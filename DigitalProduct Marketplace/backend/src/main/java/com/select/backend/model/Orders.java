package com.select.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId;      // Razorpay Order ID
    private String paymentId;    // Razorpay Payment ID
    private String status;       // "created", "paid", "failed"
    private Double amount;

    // --- CHANGED FIELDS (To match Controller) ---

    // We store the ID directly to make fetching simpler in the Controller
    private Long productId;

    // Renamed from 'customerEmail' to 'userEmail' to match Repository
    private String userEmail;

    // Added Date so Purchase History knows when it was bought
    private LocalDateTime orderDate;

    // Constructor to set date automatically
    public Orders() {
        this.orderDate = LocalDateTime.now();
    }
}