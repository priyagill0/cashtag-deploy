package com.example.backend.repository;

import com.example.backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface GroupRepository extends JpaRepository<Group, UUID> {
    List<Group> findByOwnerId(UUID ownerId);
}
