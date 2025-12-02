package com.example.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.web.bind.annotation.CrossOrigin; 
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; 
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import com.example.backend.repository.BadgeRepository;
import com.example.backend.repository.EarnedBadgeRepository;
import com.example.backend.model.Badge;
import com.example.backend.model.EarnedBadge;

@CrossOrigin(origins = { "http://localhost:3000" })
@RestController
@RequestMapping("/api/badge")
public class BadgeController {
    @Autowired EarnedBadgeRepository earnedBadgeRepository;
    @Autowired BadgeRepository  badgeRepository;

//  returns list of badges the user has earned
@GetMapping("/user/{userId}")
public List<EarnedBadge> getUserBadges(@PathVariable UUID userId) {
    return earnedBadgeRepository.findByUserId(userId);
}

// returns list of all available badges
@GetMapping
public List<Badge> getAllBadges() {
    return badgeRepository.findAll();
}
    
}