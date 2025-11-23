package com.example.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.EarnedBadge;

public interface EarnedBadgeRepository extends JpaRepository<EarnedBadge, Long> {

    List<EarnedBadge> findByUserId(UUID userId);

    boolean existsByUserIdAndBadgeId(UUID userId, Long badgeId);
    void deleteByUserIdAndBadgeId(UUID userId, Long badgeId);
}
