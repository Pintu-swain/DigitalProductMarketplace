package com.select.backend.controller;

import com.select.backend.model.Category;
import com.select.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/all")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping("/add")
    public Category addCategory(@RequestBody Map<String, String> data) {
        Category category = new Category();
        category.setName(data.get("name"));
        return categoryRepository.save(category);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
        return "Category deleted";
    }
}