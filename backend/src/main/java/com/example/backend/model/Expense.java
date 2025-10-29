package com.example.backend.model;

import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // unique ID per expense

    private String description;
    private double amount;

    @Enumerated(EnumType.STRING) // store the string representation of expense category
    private Category category;

    private LocalDate date; // <-- Date of expense, format: YYYY-MM-DD


    // this is for later, incase we want to link expenses to users object. for now, we'll just send userId from the frontend.
    // @ManyToOne  // Many expenses belong to one user
    // @JoinColumn(name = "user_id", nullable = false) // foreign key column (user_id) in expenses table
    // private User user;

    private UUID userId; // store userId directly
    
    public Expense() {}
    public Expense(String description, double amount, Category category, LocalDate date, UUID userId) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.date = date;
        this.userId = userId;
        // add recurring expense
    }

    public Long getId() { // expense id
        return id;
    }

    public UUID getUserId() {
        return userId;
    }
    
    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Category getCategory() {
        return category;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDate getDate() {
        return date;
    }
}
