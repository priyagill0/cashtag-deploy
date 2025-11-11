package com.example.backend.model;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "budgets")
public class Budget {
    // unique ID per budget, not sure if needed
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // unique ID per budget, not sure if needed

    // store the string representation of expense category
    @Enumerated(EnumType.STRING)
    private Category category;

    // month for which this budget applies, format: YYYY-MM
    private String month;

    // maximum amount allowed in this budget 
    private double maxAmount;

    // amount spent so far in this budget 
    private double currentAmount; 

    // store userId directly
    private UUID userId; 

    public Budget() {}

    public Budget(double maxAmount, double currentAmount, Category category, UUID userId, String month) {
        this.maxAmount = maxAmount;
        this.currentAmount = currentAmount;
        this.category = category;
        this.userId = userId;
        // set budget period to current month (YYYY-MM)
        this.month = month;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setMaxAmount(double maxAmount) {
        this.maxAmount = maxAmount;
    }

    public double getMaxAmount() {
        return maxAmount;
    }

    public void setCurrentAmount(double currentAmount) {
        this.currentAmount = currentAmount;
    }

    public double getCurrentAmount() {
        return currentAmount;
    }

    public String getMonth() {
        return month;
    }
}
