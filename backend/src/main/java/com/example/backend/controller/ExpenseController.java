package com.example.backend.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;          // keep POST /api/expense
import org.springframework.web.bind.annotation.RequestBody;          // keep POST /api/expense
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.model.Category;
import com.example.backend.model.Expense;
import com.example.backend.repository.ExpenseRepository;

@CrossOrigin(origins = { "http://localhost:3000" })
@RestController
@RequestMapping("/api/expense")

public class ExpenseController {

    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    //This endpoint is paginated since it is meant for UI views where you don’t want to load all expenses at once.
    @GetMapping("/user/{userId}")
    public Page<Expense> getExpensesByUser(
            @PathVariable UUID userId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date,desc") String sort
    ) {
        String[] parts = sort.split(",", 2);
        String field = parts[0].trim();
        Sort.Direction direction = (parts.length > 1 && parts[1].equalsIgnoreCase("asc"))
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, field));

        Category cat = parseCategoryOrNull(category);

        if (cat != null && q != null && !q.isBlank()) {
            return expenseRepository.findByUserIdAndCategoryAndDescriptionContainingIgnoreCase(userId, cat, q, pageable);
        } else if (cat != null) {
            return expenseRepository.findByUserIdAndCategory(userId, cat, pageable);
        } else if (q != null && !q.isBlank()) {
            return expenseRepository.findByUserIdAndDescriptionContainingIgnoreCase(userId, q, pageable);
        } else {
            return expenseRepository.findByUserId(userId, pageable);
        }
    }

    //   get all expenses for specified user (default endpoint for get user expenses)
    @GetMapping(value = "/user/{userId}", params = "all=true")
    public List<Expense> getAllExpensesByUser( @PathVariable UUID userId ) {
        return expenseRepository.findByUserId(userId, Sort.by(Sort.Direction.DESC, "date"));
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        UUID userId = expense.getUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId missing in request");
        }
        return expenseRepository.save(expense);
    }

    // helper function to parse category from string
    private Category parseCategoryOrNull(String raw) {
        if (raw == null || raw.isBlank()) return null;

        String normal = raw.trim()
                .replace('-', '_')
                .replace(' ', '_')
                .toUpperCase(Locale.ROOT);

        try {
            return Category.valueOf(normal);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid category: " + raw + ". Valid options: " + Arrays.toString(Category.values())
            );
        }
    }
}
