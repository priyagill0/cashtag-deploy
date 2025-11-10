package com.example.backend.controller;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;          // keep POST /api/expense
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;          // keep POST /api/expense
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.backend.model.Category;
import com.example.backend.model.Expense;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.ExpenseRepository;

@CrossOrigin(origins = { "http://localhost:3000" })
@RestController
@RequestMapping("/api/expense")

public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;


    public ExpenseController(ExpenseRepository expenseRepository, BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
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
    )
    
    {
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
        if(expense.getCategory() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "category missing in request");
        }
        
        budgetRepository.findByUserIdAndMonthAndCategory(
            userId,
            String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue()), //format month into YYYY-MM FORMAT
            expense.getCategory())
            .stream().findFirst().ifPresent(budget -> { // if a budget exists for the category, update amount spent.
                budget.setCurrentAmount(budget.getCurrentAmount() + expense.getAmount());
                budgetRepository.save(budget);
            });

        return expenseRepository.save(expense);
    }

    //this is for editing an expense
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) {
        Optional<Expense> existing = expenseRepository.findById(id); // use expenseRepository
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Expense expense = existing.get();
        double existingAmount = expense.getAmount();

         // Update fields
        expense.setDescription(updatedExpense.getDescription());
        expense.setAmount(updatedExpense.getAmount());
        expense.setCategory(updatedExpense.getCategory());
        expense.setDate(updatedExpense.getDate()); // optional: update date if needed

        budgetRepository.findByUserIdAndMonthAndCategory(
            expense.getUserId(),
            String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue()), //format month into YYYY-MM FORMAT
            expense.getCategory())
            .stream().findFirst().ifPresent(budget -> { // if a budget exists for the category, update amount spent.
                // remove the old amount and add the new amount ("update" the budget spent amount)
                budget.setCurrentAmount(budget.getCurrentAmount() - existingAmount + expense.getAmount() );
                budgetRepository.save(budget);
            });

        Expense saved = expenseRepository.save(expense);
        return ResponseEntity.ok(saved);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        Optional<Expense> existing = expenseRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Expense expense = existing.get();

        budgetRepository.findByUserIdAndMonthAndCategory(
            expense.getUserId(),
            String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue()), //format month into YYYY-MM FORMAT
            expense.getCategory())
            // if a budget exists for the category, update it by deleting the expense amount.
            .stream().findFirst().ifPresent(budget -> { 
                budget.setCurrentAmount(budget.getCurrentAmount() - expense.getAmount());
                budgetRepository.save(budget);
            });

        expenseRepository.deleteById(id);
        return ResponseEntity.ok().build();
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
