package com.example.backend.repository;

import com.example.backend.model.SharedExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface SharedExpenseRepository extends JpaRepository<SharedExpense, UUID> {
    List<SharedExpense> findByUserId(UUID userId);
}
