package com.example.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import com.example.backend.repository.EarnedBadgeRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend
public class UserController {

    private final UserRepository userRepository;
    private final EarnedBadgeRepository earnedBadgeRepository;

    public UserController(UserRepository userRepository, EarnedBadgeRepository earnedBadgeRepository) {
        
        this.userRepository = userRepository;
        this.earnedBadgeRepository = earnedBadgeRepository;
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
        System.out.println("User email: " + user.getEmail()); 
        if (user.getCreatedAt() == null) {
            user.setCreatedAt(LocalDateTime.now());
        }
        return userRepository.save(user);
    }
    
    @PutMapping("/{user_id}")
public ResponseEntity<User> updateUser(
        @PathVariable("user_id") UUID userId,
        @RequestBody User newData) {

    return userRepository.findById(userId)
            .map(user -> {
                user.setFirstname(newData.getFirstname());
                user.setLastname(newData.getLastname());
                return ResponseEntity.ok(userRepository.save(user));
            })
            .orElse(ResponseEntity.notFound().build());
}


    @GetMapping("/{user_id}")
public ResponseEntity<User> getUserById(@PathVariable("user_id") UUID userId) {
    return userRepository.findById(userId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
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

    @GetMapping("/{user_id}/badges")
public ResponseEntity<?> getUserBadges(@PathVariable("user_id") UUID userId) {
    var badges = earnedBadgeRepository.findByUserId(userId);
    return ResponseEntity.ok(badges);
}

}