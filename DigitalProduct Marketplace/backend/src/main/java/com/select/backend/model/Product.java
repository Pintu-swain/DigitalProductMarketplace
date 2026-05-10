package com.select.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    @Column(length = 5000)
    private String description;
    private Double price;
    private String category;

    // This creates a separate table to store the list of image URLs
    @ElementCollection
    private List<String> imageUrls;

    // Note: We keep "filePath" if you are using it for the digital download (PDF/Zip)
    // Don't confuse "imageUrls" (gallery) with "filePath" (the product itself).
    private String filePath;
}