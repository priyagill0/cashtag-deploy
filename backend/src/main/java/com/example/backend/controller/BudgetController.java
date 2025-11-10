package com.example.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.Budget;
import com.example.backend.model.Category;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.ExpenseRepository;


@CrossOrigin(origins = { "http://localhost:3000" })
@RestController
@RequestMapping("/api/budget")
public class BudgetController {
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;

    public BudgetController(BudgetRepository budgetRepository, ExpenseRepository expenseRepository) {
        this.budgetRepository = budgetRepository;
        this.expenseRepository = expenseRepository;
    }

    @GetMapping(value = "/user/{userId}")
    public List<Budget> getAllBudgetsByUser( @PathVariable UUID userId ) {
        return budgetRepository.findByUserId(userId);
    }
    // get all user budgets for specific month, e.g., 2024-06
    @GetMapping(value = "/user/{userId}/{month}") 
    public List<Budget> getBudgetsByUserAndMonth( @PathVariable UUID userId, @PathVariable String month ) {
        return budgetRepository.findByUserIdAndMonth(userId, month);
    }
    // get a specific user budget for given month and category, e.g., 2024-06 and SHOPPING
    @GetMapping(value = "/user/{userId}/{month}/{category}")
    public List<Budget> getBudgetsByUserAndMonthAndCategory( @PathVariable UUID userId, @PathVariable String month, @PathVariable String category ) {
        Category categoryEnum = Category.valueOf(category.toUpperCase());
        List <Budget> budgets = budgetRepository.findByUserIdAndMonthAndCategory(userId, month, categoryEnum);
        return budgets;
    }

    // post mapping for adding a new budget
    @PostMapping
    public void addBudget(@RequestBody Budget budget) {
        // Category categoryEnum = Category.valueOf(budget.getCategory().toString().toUpperCase());

        // Check if a budget already exists for this user/month/category
        List<Budget> existingBudgets = budgetRepository.findByUserIdAndMonthAndCategory(budget.getUserId(), budget.getMonth(), budget.getCategory());
        // We should limit to one budget per category per month in the UI somehow to avoid this error.
        if (!existingBudgets.isEmpty()) {
            throw new IllegalArgumentException("Budget for this category and month already exists!");
        }

        // Calculate currentAmount from expenses in this category for the month
        double currentAmount = expenseRepository
                .findByUserIdAndCategoryAndMonth(budget.getUserId(),  budget.getCategory(), budget.getMonth())
                .stream()
                .mapToDouble(expense -> expense.getAmount())
                .sum();
                
        Budget newBudget = new Budget(budget.getMaxAmount(), currentAmount, budget.getCategory(), budget.getUserId(), budget.getMonth()); // eventually remove expense
        budgetRepository.save(newBudget);
    }

}
