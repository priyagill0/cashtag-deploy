package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Expense;
import com.example.backend.repository.ExpenseRepository;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/expense") 
public class ExpenseController {
    
    private final ExpenseRepository expenseRepository;

    public ExpenseController(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    //   get all expenses for specified user
    @GetMapping("/user/{userId}")
    public List<Expense> getExpensesByUser(@PathVariable Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        Long userId = expense.getUserId();
        if (userId == null) {
            throw new RuntimeException("userId missing in request");
        }

        return expenseRepository.save(expense);
    }
}
