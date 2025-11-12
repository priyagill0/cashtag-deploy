package com.example.backend.controller;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
        return budgetRepository.findByUserIdAndMonth(userId, month, Sort.by("category").ascending());
    }
    // get a specific user budget for given month and category, e.g., 2024-06 and SHOPPING
    @GetMapping(value = "/user/{userId}/{month}/{category}")
    public List<Budget> getBudgetsByUserAndMonthAndCategory( @PathVariable UUID userId, @PathVariable String month, @PathVariable String category ) {
        Category categoryEnum = Category.valueOf(category.toUpperCase());
        List <Budget> budgets = budgetRepository.findByUserIdAndMonthAndCategory(userId, month, categoryEnum);
        return budgets;
    }

    // delete a specific user budget for given month and category, e.g., 2024-06 and SHOPPING
    @DeleteMapping(value = "/user/{userId}/{month}/{category}")
    public void deleteBudget( @PathVariable UUID userId, @PathVariable String month, @PathVariable String category ) {
        Category categoryEnum = Category.valueOf(category.toUpperCase());
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndCategory(userId, month, categoryEnum);
        if (budgets.isEmpty()) {
            throw new IllegalArgumentException("No budget found for this user, month, and category.");
        }
        // Only one budget per user/month/category
        budgetRepository.delete(budgets.get(0));
    }

    // this is for editing a budget
    @PutMapping(value = "/user/{userId}/{month}/{category}")
    public void updateBudget(@PathVariable UUID userId, @PathVariable String month, @PathVariable String category, @RequestBody Budget updatedBudget) {
        Category categoryEnum = Category.valueOf(category.toUpperCase());
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndCategory(userId, month, categoryEnum);
        if (budgets.isEmpty()) {
            throw new IllegalArgumentException("No budget found for this user, month, and category.");
        }
         // Only one budget per user/month/category
        Budget existingBudget = budgets.get(0);

        // Update fields
        existingBudget.setMaxAmount(updatedBudget.getMaxAmount());
        existingBudget.setCategory(updatedBudget.getCategory());

        budgetRepository.save(existingBudget);
    }

    // post mapping for adding a new budget
    @PostMapping
    public void addBudget(@RequestBody Budget budget) {
        // Category categoryEnum = Category.valueOf(budget.getCategory().toString().toUpperCase());

        // Check if a budget already exists for this user/month/category
        List<Budget> existingBudgets = budgetRepository.findByUserIdAndMonthAndCategory(budget.getUserId(), budget.getMonth(), budget.getCategory());

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

    // This endpoint returns the categories that do not have a budget for the specified user and month.
    @GetMapping("/user/{userId}/{month}/available-categories")
    public List<Category> getAvailableCategories(@PathVariable UUID userId, @PathVariable String month) {
        List<Budget> existingBudgets = budgetRepository.findByUserIdAndMonth(userId, month, Sort.by("category").ascending());
        
        // Remove categories that already have a budget
        List<Category> availableCategories = Arrays.stream(Category.values())
            .filter(c -> existingBudgets.stream().noneMatch(b -> b.getCategory().equals(c)))
            .toList();
        
        return availableCategories;
    }
}
