package com.select.backend.controller;

import com.select.backend.model.Orders;
import com.select.backend.model.Product;
import com.select.backend.repository.OrderRepository;
import com.select.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // Fixed to use @PathVariable to match React call: api.get(`/orders/user/${user.email}`)
    @GetMapping("/user/{email}")
    public ResponseEntity<List<Map<String, Object>>> getUserOrders(@PathVariable String email) {
        // Fetch all orders for the user
        List<Orders> orders = orderRepository.findByUserEmailIgnoreCase(email);

        List<Map<String, Object>> collection = orders.stream()
                // Filter to only show items the user actually paid for
                .filter(order -> "PAID".equalsIgnoreCase(order.getStatus()))
                .map(order -> {
                    Product product = productRepository.findById(order.getProductId()).orElse(null);

                    String downloadUrl = "";
                    if (product != null && product.getFilePath() != null) {
                        String path = product.getFilePath();
                        String fileName = path.substring(Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/')) + 1);
                        downloadUrl = "http://localhost:8080/uploads/" + fileName;
                    }

                    return Map.<String, Object>of(
                            "id", order.getId(),
                            "orderId", order.getOrderId(),
                            "date", (order.getOrderDate() != null) ? order.getOrderDate().toString() : "N/A",
                            "status", order.getStatus(),
                            "amount", order.getAmount(),
                            "productName", (product != null) ? product.getName() : "Product Removed",
                            "productImage", (product != null && product.getImageUrls() != null && !product.getImageUrls().isEmpty())
                                    ? product.getImageUrls().get(0) : "",
                            "downloadUrl", downloadUrl
                    );
                }).collect(Collectors.toList());

        return ResponseEntity.ok(collection);
    }
}