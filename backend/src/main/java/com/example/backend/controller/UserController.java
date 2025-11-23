package com.example.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<User> getAllUsers() {
        System.out.println("\nFetching all users from database...\n");
        return userRepository.findAll();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        System.out.println("\nSaving user to database...\n");
        System.out.println("Received user ID: " + user.getId());  // debug
        System.out.println("User email: " + user.getEmail()); //debugging
        return userRepository.save(user);
    }
        
    @GetMapping("/{user_id}/streak")
    public int getUserStreak(@PathVariable("user_id") UUID userId) {
        var user =  userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get().getCurrentStreak();
        } else {
            return 1; // default streak
        }
    }
}