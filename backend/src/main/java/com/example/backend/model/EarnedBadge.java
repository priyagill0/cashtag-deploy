package com.example.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "earned_badge")
public class EarnedBadge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // unique ID per earned badge

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // the user who earned the badge

    @ManyToOne(optional = false)
    @JoinColumn(name = "badge_id", nullable = false)
    private Badge badge; // the badge that was earned

    @Column(name = "earned_at", nullable = false)
    private LocalDateTime earnedAt = LocalDateTime.now();

    public EarnedBadge() {}

    public EarnedBadge(User user, Badge badge) {
        this.user = user;
        this.badge = badge;
        this.earnedAt = LocalDateTime.now();
    }

    // Getters / setters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Badge getBadge() { return badge; }
    public void setBadge(Badge badge) { this.badge = badge; }
    public LocalDateTime getEarnedAt() { return earnedAt; }
}
