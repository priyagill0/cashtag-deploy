package com.example.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "badge")
public class Badge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String icon;

    // private boolean isActive = false;

    @Enumerated(EnumType.STRING)
    private BadgeEventType eventType;

    private int threshold;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Badge() {}

    public Badge(Long id, String name, String description, String icon,
                   BadgeEventType eventType, int threshold) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.eventType = eventType;
        this.threshold = threshold;
    }

    // Useful constructor for creating new badges
    public Badge(Long id, String name, String description,
                  BadgeEventType eventType, int threshold) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.eventType = eventType;
        this.threshold = threshold;
    } 

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    } 

    public BadgeEventType getEventType() {
        return eventType;
    }

    public void setEventType(BadgeEventType eventType) {
        this.eventType = eventType;
    }

    public int getThreshold() {
        return threshold;
    }

    public void setThreshold(int threshold) {
        this.threshold = threshold;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
