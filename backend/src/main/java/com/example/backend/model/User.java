package com.example.backend.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(columnDefinition = "UUID",  updatable = false, nullable = false)
    //@GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // private String username;
    private String firstname;
    private String lastname;
    
    @Column(unique = true, nullable = false) // Makes email unique
    private String email;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; 

    @Column(name = "last_login_date")
    private LocalDate lastLoginDate;
     
    @Column(name = "current_streak", nullable = false, columnDefinition = "int default 0")
    private int currentStreak = 0;

    // Constructors
    public User() {}
    public User(UUID id, String email, String firstname, String lastname) {
        // this.username = username;
        this.id = id;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        
    }

    // Getters & Setters
    public UUID getId() { return id; }
    // public String getUsername() { return username; }
    public String getFirstname() { return firstname; }
    public String getLastname() { return lastname; }
    public String getEmail() { return email; }


   public void setId(UUID id) { this.id = id; }
    // public void setUsername(String username) { this.username = username; }
    public void setFirstname(String firstname) { this.firstname = firstname; }
    public void setLastname(String lastname) { this.lastname = lastname; }
    public void setEmail(String email) { this.email = email; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDate getLastLoginDate() { return lastLoginDate; }
    public void setLastLoginDate(LocalDate lastLoginDate) { this.lastLoginDate = lastLoginDate; }

    public int getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(int currentStreak) { this.currentStreak = currentStreak; }
}
