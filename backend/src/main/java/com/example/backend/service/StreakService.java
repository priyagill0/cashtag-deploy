package com.example.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.backend.model.User;
import com.example.backend.model.BadgeEventType;
import com.example.backend.repository.UserRepository;
import java.time.LocalDate;
import java.util.UUID;


@Service
public class StreakService {

    @Autowired 
    private UserRepository userRepository;

    @Autowired 
    private BadgeService badgeService;

    public void handleLogin(UUID userId, LocalDate loginDate) {

        User user = userRepository.findById(userId).orElseThrow();

        LocalDate lastLogin = user.getLastLoginDate();
        int streak = user.getCurrentStreak();

        if (lastLogin == null) {
            streak = 1; // first login ever
        } 
        else if (lastLogin.plusDays(1).isEqual(loginDate)) {
            streak += 1; // continue streak
        } 
        else if (!lastLogin.isEqual(loginDate)) { 
            streak = 1; // streak broken → reset to 1
        }

        // Save new streak + login date
        user.setLastLoginDate(loginDate);
        user.setCurrentStreak(streak);
        userRepository.save(user);

        // Award badge IF the threshold (2) is met
        badgeService.checkAndAwardBadge(userId, BadgeEventType.STREAK, streak);
    } 
}

