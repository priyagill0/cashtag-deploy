package com.example.backend.controller;

import java.time.LocalDate;
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

import com.example.backend.model.BadgeEventType;
import com.example.backend.model.Category;
import com.example.backend.model.Expense;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.service.BadgeService;

//new
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import com.example.backend.dto.HighestTransaction;
import com.example.backend.dto.MonthlySpendingReport;
import com.example.backend.model.Category;
import com.example.backend.model.Expense;


@CrossOrigin(origins = { "http://localhost:3000" })
@RestController
@RequestMapping("/api/expense")

public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final BadgeService badgeService;


    public ExpenseController(ExpenseRepository expenseRepository, BudgetRepository budgetRepository, BadgeService badgeService) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.badgeService = badgeService;
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
      
        Expense savedExpense = expenseRepository.save(expense);

        // if expense is recurring 
        if (expense.isRecurring()){
            LocalDate date = savedExpense.getDate();

            // loop through each month until dec of that year
            for (int month = date.getMonthValue() + 1; month <= 12; month++){
                LocalDate nextDate = LocalDate.of(date.getYear(), month, date.getDayOfMonth());

                // create a copy of the expense
                Expense expenseCopy = new Expense(
                    savedExpense.getDescription(),
                    savedExpense.getAmount(),
                    savedExpense.getCategory(),
                    nextDate,
                    savedExpense.getUserId(),
                    true);

                expenseRepository.save(expenseCopy); // add the expense to repository for each month
            }
        }

        //  Check and award badge for adding first expense
        badgeService.checkAndAwardBadge(
            userId,
            BadgeEventType.ADD_EXPENSE,
            expenseRepository.countByUserId(userId)
        );

        // Check if all budgets are still under their limits after adding this expense
        List<Expense> expenses = expenseRepository.findByUserIdAndCategoryAndMonth(
            userId,
            expense.getCategory(),
            String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue())
        );
        // Calculate total expenses for that category and month
        double expensesTotal = expenses.stream()
        .mapToDouble(Expense::getAmount)
        .sum();

        badgeService.checkAndRemoveUnderAllBudgetsBadge(
            userId,
            expense.getCategory(),
            String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue()),
            expensesTotal
        );

  
        return savedExpense;
    }

    //this is for editing an expense
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense updatedExpense) {
        UUID userId = updatedExpense.getUserId();

        Optional<Expense> existing = expenseRepository.findById(id); // use expenseRepository
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Expense expense = existing.get();
        double oldAmount = expense.getAmount();
        Category oldCategory = expense.getCategory();
        String month = String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue());

         // Update fields
        expense.setDescription(updatedExpense.getDescription());
        expense.setAmount(updatedExpense.getAmount());
        expense.setCategory(updatedExpense.getCategory());
        expense.setDate(updatedExpense.getDate()); // optional: update date if needed

        if (oldCategory.equals(expense.getCategory())) {
            // Same category → adjust the budget by the difference
            budgetRepository.findByUserIdAndMonthAndCategory(expense.getUserId(), month, expense.getCategory())
                .stream().findFirst().ifPresent(budget -> {
                    budget.setCurrentAmount(budget.getCurrentAmount() + expense.getAmount() - oldAmount);
                    budgetRepository.save(budget);
                });
        } else {
            // Category changed → deduct from old budget, and add to new budget
            budgetRepository.findByUserIdAndMonthAndCategory(expense.getUserId(), month, oldCategory)
                .stream().findFirst().ifPresent(budget -> {
                    budget.setCurrentAmount(budget.getCurrentAmount() - oldAmount);
                    budgetRepository.save(budget);
                });
    
            budgetRepository.findByUserIdAndMonthAndCategory(expense.getUserId(), month, expense.getCategory())
                .stream().findFirst().ifPresent(budget -> {
                    budget.setCurrentAmount(budget.getCurrentAmount() + expense.getAmount());
                    budgetRepository.save(budget);
                });
        }
        Expense saved = expenseRepository.save(expense);

        // Check if all budgets are still under their limits after adding this expense
        List<Expense> expenses = expenseRepository.findByUserIdAndCategoryAndMonth(
            userId,
            expense.getCategory(),
            String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue())
        );

        // Calculate total expenses for that category and month
        double expensesTotal = expenses.stream()
        .mapToDouble(Expense::getAmount)
        .sum();

        badgeService.checkAndRemoveUnderAllBudgetsBadge(
            userId,
            expense.getCategory(),
            String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue()),
            expensesTotal
        );

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        Optional<Expense> existing = expenseRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Expense expense = existing.get();
        // format month into YYYY-MM FORMAT
        String month = String.format("%d-%02d", expense.getDate().getYear(), expense.getDate().getMonthValue());
        
        // if a budget exists for the category, update it by deleting the expense amount.
        budgetRepository.findByUserIdAndMonthAndCategory(expense.getUserId(), month, expense.getCategory())
            .stream().findFirst().ifPresent(budget -> { 
                budget.setCurrentAmount(budget.getCurrentAmount() - expense.getAmount());
                budgetRepository.save(budget);
            });

        expenseRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    //monthly spending report
    @GetMapping("/user/{userId}/monthly-report")
    public MonthlySpendingReport getMonthlyReport(
            @PathVariable UUID userId,
            @RequestParam String month
    ) {

        if (month == null || month.length() != 7 || month.charAt(4) != '-') {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid month format. Expected YYYY-MM");
        }

        LocalDate startDate;
        try {
            startDate = LocalDate.parse(month + "-01");
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid month value. Expected YYYY-MM");
        }

        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        // previous month
        LocalDate prevStart = startDate.minusMonths(1).withDayOfMonth(1);
        LocalDate prevEnd = prevStart.withDayOfMonth(prevStart.lengthOfMonth());

        Sort sortByDate = Sort.by(Sort.Direction.ASC, "date");

        // this month expenses
        List<Expense> thisMonth = expenseRepository.findByUserIdAndDateBetween(
                userId, startDate, endDate, sortByDate
        );

        // ---- HIGHEST SINGLE EXPENSE ----
        Expense highestExpense = null;

        if (!thisMonth.isEmpty()) {
    highestExpense = thisMonth.stream()
            .max((a, b) -> Double.compare(a.getAmount(), b.getAmount()))
            .orElse(null);
}


        // last month expenses
        List<Expense> lastMonth = expenseRepository.findByUserIdAndDateBetween(
                userId, prevStart, prevEnd, sortByDate
        );

        // Calculate totals + categories

        double totalThisMonth = 0.0;
        Map<String, Double> byCategory = new HashMap<>();

        for (Expense e : thisMonth) {
            if (e == null) continue;

            double amt = e.getAmount();
            totalThisMonth += amt;

            String cat = (e.getCategory() != null)
                    ? e.getCategory().name()
                    : "UNCATEGORIZED";

            byCategory.merge(cat, amt, Double::sum);
        }

        // find biggest category
        String biggestCat = null;
        double biggestAmount = 0.0;
        for (Map.Entry<String, Double> entry : byCategory.entrySet()) {
            if (entry.getValue() > biggestAmount) {
                biggestAmount = entry.getValue();
                biggestCat = entry.getKey();
            }
        }

        // last month totals
        double totalLastMonth = 0.0;
        for (Expense e : lastMonth) {
            if (e != null) {
                totalLastMonth += e.getAmount();
            }
        }

        // percent change
        Double percentChange = null;
        if (totalLastMonth > 0) {
            percentChange = ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100.0;
        }


        MonthlySpendingReport report = new MonthlySpendingReport();

        report.setMonth(month);
        report.setStartDate(startDate);
        report.setEndDate(endDate);

        report.setTotalSpending(totalThisMonth);
        report.setTransactionCount(thisMonth.size());

        report.setSpendingByCategory(byCategory);
        report.setBiggestExpenseCategory(biggestCat);
        report.setBiggestExpenseAmount(biggestAmount);

        report.setLastMonthTotalSpending(totalLastMonth);
        report.setLastMonthTransactionCount(lastMonth.size());
        report.setPercentChangeFromLastMonth(percentChange);

        // Add highest single transaction if found
    if (highestExpense != null) {
        // Build DTO object
        HighestTransaction highestDto = new HighestTransaction();
        highestDto.setAmount(highestExpense.getAmount());
        highestDto.setCategory(highestExpense.getCategory().name());
        highestDto.setDescription(highestExpense.getDescription());
        highestDto.setDate(highestExpense.getDate());

        // attach to report
        report.setHighestTransaction(highestDto);

}


        return report;
    }


    //NEW!!!
    @GetMapping("/user/{userId}/trend")
public Map<String, Double> get6MonthTrend(@PathVariable UUID userId) {
    LocalDate now = LocalDate.now();

    Map<String, Double> result = new LinkedHashMap<>();

    for (int i = 5; i >= 0; i--) {
        LocalDate monthDate = now.minusMonths(i);
        String ym = String.format("%d-%02d", monthDate.getYear(), monthDate.getMonthValue());

        List<Expense> monthly = expenseRepository.findByUserIdAndDateBetween(
            userId,
            monthDate.withDayOfMonth(1),
            monthDate.withDayOfMonth(monthDate.lengthOfMonth()),
            Sort.by("date")
        );

        double total = monthly.stream().mapToDouble(Expense::getAmount).sum();
        result.put(ym, total);
    }
    return result;
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