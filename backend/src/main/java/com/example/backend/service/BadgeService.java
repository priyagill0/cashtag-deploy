package com.example.backend.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.model.Badge;
import com.example.backend.model.BadgeEventType;
import com.example.backend.model.Category;
import com.example.backend.model.EarnedBadge;
import com.example.backend.model.User;
import com.example.backend.repository.BadgeRepository;
import com.example.backend.repository.EarnedBadgeRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import com.example.backend.repository.BudgetRepository;

@Service
public class BadgeService {

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private EarnedBadgeRepository earnedBadgeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    public void checkAndAwardBadge(UUID userId, BadgeEventType eventType, int progressValue) {

        // Load user 
        if (userId == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        
        // Only ONE badge per event type
        Badge badge = badgeRepository.findByEventType(eventType)
                .orElseThrow(() -> new RuntimeException("Badge not found for event type: " + eventType));
        
        // Check threshold
        if (progressValue < badge.getThreshold()) {
            return; // not eligible for badge yet
        }

        // Avoid duplicates
        boolean alreadyExists = earnedBadgeRepository.existsByUserIdAndBadgeId(userId, badge.getId());
        if (alreadyExists) return;

        // Award Badge
        EarnedBadge earned = new EarnedBadge(user, badge);
        earnedBadgeRepository.save(earned);
    }

    // Remove the UNDER_ALL_BUDGETS badge if user no longer qualifies or has exceeded a monthly budget.
    @Transactional
    public void checkAndRemoveUnderAllBudgetsBadge(UUID userId, Category category, String month, double expensesTotal) {
        // Load user 
        if (userId == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }

        // Check if user is still under budget for the given category and month
        var budgetOptional = budgetRepository.findByUserIdAndMonthAndCategory(userId, month, category)
        .stream()
        .findFirst();

        if (budgetOptional.isPresent() && expensesTotal <= budgetOptional.get().getMaxAmount()) {
            return; // still under budget
        }

        // Only ONE badge per event type
        Badge badge = badgeRepository.findByEventType(BadgeEventType.UNDER_ALL_BUDGETS)
                .orElseThrow(() -> new RuntimeException("Badge not found for event type: " + BadgeEventType.UNDER_ALL_BUDGETS));
        
        // Remove Badge if exists
        boolean alreadyExists = earnedBadgeRepository.existsByUserIdAndBadgeId(userId, badge.getId());
        if (alreadyExists) {
            earnedBadgeRepository.deleteByUserIdAndBadgeId(userId, badge.getId());
        }
    }
}
