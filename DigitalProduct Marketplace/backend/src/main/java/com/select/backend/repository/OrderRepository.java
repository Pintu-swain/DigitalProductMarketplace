package com.select.backend.repository;

import com.select.backend.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByOrderId(String orderId);

    // FIX: Match email while ignoring case to prevent empty collections
    List<Orders> findByUserEmailIgnoreCaseOrderByIdDesc(String userEmail);

    // Used for general user lookups
    List<Orders> findByUserEmailIgnoreCase(String userEmail);
}