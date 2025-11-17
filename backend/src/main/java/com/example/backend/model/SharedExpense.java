
package com.example.backend.model;
import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "shared_expense")
public class SharedExpense {
    @Id
    @Column(columnDefinition = "UUID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "expense_id", nullable = false) 
    @JsonBackReference
    private GroupExpense expense;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) 
    private User user;

    private double debt;
    private boolean settled = false;

    // getters & setters same format and Groupsmembers but adding the debt which is the amount the user has to pay to another person in group 
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public GroupExpense getExpense() { return expense; }
    public void setExpense(GroupExpense expense) { this.expense = expense; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public double getDebt() { return debt; }
    public void setDebt(double amountOwed) { this.debt = amountOwed; }

    public boolean isSettled() { return settled; }
    public void setSettled(boolean settled) { this.settled = settled; }
}
