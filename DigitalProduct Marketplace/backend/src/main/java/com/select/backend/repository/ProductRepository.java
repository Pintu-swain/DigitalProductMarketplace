package com.select.backend.repository;

import com.select.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 1. Existing Search (Kept for Admin or internal use if needed)
    List<Product> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category);
    List<Product> findByCategoryIgnoreCase(String category);

    // 2. PAGINATED Search (New!)
    // These return a "Page" of products instead of a full List
    Page<Product> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category, Pageable pageable);

    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);
}