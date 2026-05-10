package com.select.backend.controller;

import com.select.backend.model.User;
import com.select.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // REGISTER API
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    // LOGIN API (The one we are fixing)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> data) {
        String email = data.get("email");
        String password = data.get("password");

        // 1. Find User by Email
        User user = userRepository.findByEmail(email);

        // 2. Validate Password (Simple check for MVP)
        if (user != null && user.getPassword().equals(password)) {

            // --- CRITICAL FIX: Return User Data as JSON ---
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail()); // <--- This is what was missing!
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid Credentials");
    }
}