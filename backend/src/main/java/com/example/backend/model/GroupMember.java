package com.example.backend.model;

import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "group_members")
public class GroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private UUID id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // private String role;

    // getters & setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Group getGroup() { return group; }
    public void setGroup(Group group) { this.group = group; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    // public String getRole() { return role; }
    // public void setRole(String role) { this.role = role; }
}
