package com.example.backend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.backend.model.Badge;
import com.example.backend.model.BadgeEventType;
import com.example.backend.model.Budget;
import com.example.backend.model.User;
import com.example.backend.repository.BadgeRepository;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.EarnedBadgeRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.GroupRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class BadgeBackfillService {
    

    @Autowired private BadgeRepository badgeRepository;
    @Autowired private ExpenseRepository expenseRepository;
    @Autowired private BudgetRepository budgetRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private BadgeService badgeService;


    // Check all badges for a given user based on historical data
    public void checkAllBadgesForUser(UUID userId) {

        User user = userRepository.findById(userId).orElseThrow();
       
        //  ADD_EXPENSE badges  
        Badge expenseBadge = badgeRepository.findByEventType(BadgeEventType.ADD_EXPENSE)
                .orElse(null);
        if (expenseBadge != null) {
            int totalExpenses = expenseRepository.countByUserId(userId);
            badgeService.checkAndAwardBadge(user.getId(), BadgeEventType.ADD_EXPENSE, totalExpenses);
        } 

        // ADD_BUDGET badges
        Badge budgetBadge = badgeRepository.findByEventType(BadgeEventType.ADD_BUDGET)
                .orElse(null);
        if (budgetBadge != null) {
            int totalBudgets = budgetRepository.findByUserId(userId).size();
            badgeService.checkAndAwardBadge(user.getId(), BadgeEventType.ADD_BUDGET, totalBudgets);
        }

        // UNDER_ALL_BUDGET badges
        Badge underBudgetBadge = badgeRepository.findByEventType(BadgeEventType.UNDER_ALL_BUDGETS)
                .orElse(null);
        if (underBudgetBadge != null) {
            // Get current month in "yyyy-MM" format
            LocalDate now = LocalDate.now();
            String currentMonth = now.format(DateTimeFormatter.ofPattern("yyyy-MM"));

            // Get all budgets for the user
            List<Budget> budgets = budgetRepository.findByUserIdAndMonth(userId, currentMonth, Sort.by("category").ascending());

            // Check each budget month that it is less than the limit
            boolean allUnderLimit = budgets.stream()
            .allMatch(b -> b.getCurrentAmount() <= b.getMaxAmount());

            // Award the badge if all budgets for the month are under the limit
            if (allUnderLimit) {
                badgeService.checkAndAwardBadge(user.getId(), BadgeEventType.UNDER_ALL_BUDGETS, 0);
            }
        }  
}
}
