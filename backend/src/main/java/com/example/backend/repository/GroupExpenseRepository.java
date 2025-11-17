package com.example.backend.repository;

import com.example.backend.model.GroupExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface GroupExpenseRepository extends JpaRepository<GroupExpense, UUID> {
    List<GroupExpense> findByGroupId(UUID groupId);
}
