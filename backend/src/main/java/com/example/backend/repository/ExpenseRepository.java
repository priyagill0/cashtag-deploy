package com.example.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Expense;


public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByDate(LocalDate date);
    List<Expense> findByDateBetween(LocalDate start, LocalDate end); // useful for getting expenses for the whole month
    // List<Expense> findByUser(User user);
    List<Expense> findByUserId(UUID userId);
}
