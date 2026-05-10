package com.select.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true) // No duplicate emails
    private String email;

    private String password; // Stored as text for simplicity (Use encryption in production)

    private String role; // "USER" or "ADMIN"
}