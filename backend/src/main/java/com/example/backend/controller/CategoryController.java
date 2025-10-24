package com.example.backend.controller;
import java.util.Arrays;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Category;

@RestController
@RequestMapping("/api/categories") 
public class CategoryController {

    @GetMapping
    public List<Category> getCategories() { 
        return Arrays.asList(Category.values());
    }
}
