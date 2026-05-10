package com.select.backend.controller;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.select.backend.model.Orders;
import com.select.backend.model.Product;
import com.select.backend.repository.OrderRepository;
import com.select.backend.repository.ProductRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        Double amount = Double.parseDouble(data.get("amount").toString());
        String email = (String) data.get("email");

        List<Long> productIds = new ArrayList<>();
        if (data.containsKey("productIds")) {
            List<?> rawList = (List<?>) data.get("productIds");
            productIds = rawList.stream().map(id -> Long.parseLong(id.toString())).collect(Collectors.toList());
        } else if (data.containsKey("productId")) {
            productIds.add(Long.parseLong(data.get("productId").toString()));
        }

        RazorpayClient client = new RazorpayClient(keyId, keySecret);
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amount * 100);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        com.razorpay.Order razorpayOrder = client.orders.create(orderRequest);
        String rzpOrderId = razorpayOrder.get("id");

        for (Long pId : productIds) {
            Orders newOrder = new Orders();
            newOrder.setOrderId(rzpOrderId);
            newOrder.setAmount(amount);
            newOrder.setStatus("CREATED");
            newOrder.setUserEmail(email);
            newOrder.setProductId(pId);
            newOrder.setOrderDate(LocalDateTime.now());
            orderRepository.save(newOrder);
        }

        return ResponseEntity.ok(Map.of("orderId", rzpOrderId));
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        String rzpOrderId = data.get("razorpay_order_id");
        String rzpPaymentId = data.get("razorpay_payment_id");

        List<Orders> orders = orderRepository.findByOrderId(rzpOrderId);
        if (orders != null && !orders.isEmpty()) {
            String lastFileLink = "";
            for (Orders order : orders) {
                order.setPaymentId(rzpPaymentId);
                order.setStatus("PAID");
                orderRepository.save(order);

                // Fetch the product to get the file path
                Product product = productRepository.findById(order.getProductId()).orElse(null);
                if (product != null && product.getFilePath() != null) {
                    String path = product.getFilePath();
                    // Extract filename from the path
                    String fileName = path.substring(Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/')) + 1);
                    lastFileLink = "http://localhost:8080/uploads/" + fileName;
                }
            }
            // Return 'fileLink' to match the frontend key
            return ResponseEntity.ok(Map.of("success", true, "fileLink", lastFileLink));
        }
        return ResponseEntity.status(400).body("Verification Failed");
    }
}