package com.example.backend.model;

import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.time.LocalDate;


@Entity
@Table(name = "group_expense")
public class GroupExpense {
    @Id
    @Column(columnDefinition = "UUID")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String description;
    private double total; //how much was spent 
    private LocalDate date;
    
   private String category;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    private Group group;

    @ManyToOne
    @JoinColumn(name = "paid_by", nullable = false)
    private User paidBy;

    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<SharedExpense> shares = new ArrayList<>();

    // getters & setters
    public UUID getId() { return id; }
   // public void setId(UUID id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Group getGroup() { return group; }
    public void setGroup(Group group) { this.group = group; }

    public User getPaidBy() { return paidBy; }
    public void setPaidBy(User paidBy) { this.paidBy = paidBy; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    

    public List<SharedExpense> getShares() { return shares; }
    public void setShares(List<SharedExpense> shares) { this.shares = shares; }
}
