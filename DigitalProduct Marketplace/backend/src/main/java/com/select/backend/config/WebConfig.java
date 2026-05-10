package com.select.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // This tells Spring Boot:
        // "When anyone asks for /uploads/..., go look in D:/select_uploads/"
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:D:/select_uploads/");
    }
}