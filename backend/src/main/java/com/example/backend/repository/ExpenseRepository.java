package com.example.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.model.Category;
import com.example.backend.model.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

     // List<Expense> findByUser(User user);
    List<Expense> findByUserId(UUID userId);
    
    List<Expense> findByUserId(UUID userId, Sort sort);

    List<Expense> findByUserIdAndCategory(UUID userId, Category category, Sort sort);
    List<Expense> findByUserIdAndDescriptionContainingIgnoreCase(UUID userId, String q, Sort sort);
    List<Expense> findByUserIdAndCategoryAndDescriptionContainingIgnoreCase(
            UUID userId, Category category, String q, Sort sort);

    List<Expense> findByDate(LocalDate date);
    List<Expense> findByDateBetween(LocalDate start, LocalDate end);
    List<Expense> findByUserIdAndDateBetween(UUID userId, LocalDate start, LocalDate end, Sort sort);

    // Pageable
    Page<Expense> findByUserId(UUID userId, Pageable pageable);
    Page<Expense> findByUserIdAndCategory(UUID userId, Category category, Pageable pageable);
    Page<Expense> findByUserIdAndDescriptionContainingIgnoreCase(UUID userId, String q, Pageable pageable);
    Page<Expense> findByUserIdAndCategoryAndDescriptionContainingIgnoreCase(
            UUID userId, Category category, String q, Pageable pageable);

    Page<Expense> findByDate(LocalDate date, Pageable pageable);
    Page<Expense> findByDateBetween(LocalDate start, LocalDate end, Pageable pageable);
    Page<Expense> findByUserIdAndDateBetween(UUID userId, LocalDate start, LocalDate end, Pageable pageable);

    // Custom query to find expenses by userId, category, and month (YYYY-MM)
    @Query("SELECT e FROM Expense e WHERE e.userId = :userId AND e.category = :category  AND FUNCTION('TO_CHAR', e.date, 'YYYY-MM') = SUBSTRING(:month, 1, 7)")
    List<Expense> findByUserIdAndCategoryAndMonth(
        @Param("userId") UUID userId,
        @Param("category") Category category,
        @Param("month") String month
    );
    // Count # of expenses by userId
    int countByUserId(UUID userId);
}
