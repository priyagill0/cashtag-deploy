package com.example.backend.repository;

import com.example.backend.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    List<GroupMember> findByUserId(UUID userId);
}
