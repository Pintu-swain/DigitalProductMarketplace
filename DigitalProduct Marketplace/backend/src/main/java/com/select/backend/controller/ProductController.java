package com.select.backend.controller;

import com.select.backend.model.Product;
import com.select.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // ------------------- PAGINATION APIS (For Home Page) -------------------

    // 1. HOME PRODUCT LIST (Paged)
    // Use this API for the user homepage to support "Next/Previous" buttons
    @GetMapping("/home")
    public Page<Product> getHomeProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        // Sort by ID descending (Newest products first)
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return productRepository.findAll(pageable);
    }

    // 2. SEARCH API (Paged)
    @GetMapping("/search")
    public Page<Product> searchProducts(
            @RequestParam("q") String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query, pageable);
    }

    // 3. CATEGORY API (Paged)
    @GetMapping("/category")
    public Page<Product> getByCategory(
            @RequestParam("cat") String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return productRepository.findByCategoryIgnoreCase(category, pageable);
    }

    // ------------------- ADMIN APIS (Keep these simple) -------------------

    // 4. GET ALL PRODUCTS (List) - Kept for Admin Dashboard to avoid breaking it
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // 5. GET SINGLE PRODUCT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. ADD PRODUCT
    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam(value = "category", defaultValue = "General") String category,
            @RequestParam("images") List<MultipartFile> images,
            @RequestParam("productFile") MultipartFile productFile
    ) {
        try {
            // Save Product File
            String productFileName = System.currentTimeMillis() + "_" + productFile.getOriginalFilename();
            String productPath = "D:/select_uploads/" + productFileName;
            productFile.transferTo(new java.io.File(productPath));

            // Save Images
            List<String> imagePaths = new ArrayList<>();
            for (MultipartFile img : images) {
                String imgName = System.currentTimeMillis() + "_" + img.getOriginalFilename();
                String imgPath = "D:/select_uploads/" + imgName;
                img.transferTo(new java.io.File(imgPath));
                imagePaths.add("http://localhost:8080/uploads/" + imgName);
            }

            Product product = new Product();
            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(category);
            product.setFilePath(productPath);
            product.setImageUrls(imagePaths);

            productRepository.save(product);
            return ResponseEntity.ok("Product added successfully!");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // 7. UPDATE PRODUCT
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            @RequestParam(value = "productFile", required = false) MultipartFile productFile
    ) {
        try {
            Product product = productRepository.findById(id).orElse(null);
            if (product == null) return ResponseEntity.status(404).body("Product not found");

            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);

            if (category != null && !category.isEmpty()) {
                product.setCategory(category);
            }

            if (images != null && !images.isEmpty()) {
                List<String> imagePaths = new ArrayList<>();
                for (MultipartFile img : images) {
                    String imgName = System.currentTimeMillis() + "_" + img.getOriginalFilename();
                    String imgPath = "D:/select_uploads/" + imgName;
                    img.transferTo(new java.io.File(imgPath));
                    imagePaths.add("http://localhost:8080/uploads/" + imgName);
                }
                product.setImageUrls(imagePaths);
            }

            if (productFile != null) {
                String productFileName = System.currentTimeMillis() + "_" + productFile.getOriginalFilename();
                String productPath = "D:/select_uploads/" + productFileName;
                productFile.transferTo(new java.io.File(productPath));
                product.setFilePath(productPath);
            }

            productRepository.save(product);
            return ResponseEntity.ok("Product updated successfully!");

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // 8. DELETE PRODUCT
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Product deleted successfully");
        }
        return ResponseEntity.status(404).body("Product not found");
    }
}