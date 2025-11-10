package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    //inject the repositories to interact with the database
    @Autowired private GroupRepository groupRepo;
    @Autowired private GroupMemberRepository memberRepo;
    @Autowired private UserRepository userRepo;
    
    //this creates a new group and automatically adds the creator as a member.
    @PostMapping("/create")

    public ResponseEntity<Group> createGroup(@RequestBody Map<String, String> req) {
        System.out.println("Incoming request body: " + req);
        
         //extract group name and owner ID from the frontend request
        String name = req.get("name");
        UUID ownerId = UUID.fromString(req.get("ownerId"));

        // Find the owner in the database
        User owner = userRepo.findById(ownerId).orElse(null);
    
        // if (owner == null) {
        //     System.out.println("Owner not found for ID");
        //     return ResponseEntity.badRequest().build();
        // }
            
        //create and save a new group
        Group g = new Group();
        g.setName(name);
        g.setOwner(owner);
        Group saved = groupRepo.save(g);
    
        GroupMember m = new GroupMember();
        m.setGroup(saved);
        m.setUser(owner);
        // m.setRole("OWNER");
        memberRepo.save(m);  
        return ResponseEntity.ok(saved); //return the saved group
    }
    
    //adds another user (member) to the group
    @PostMapping("/invite")
    public ResponseEntity<String> inviteUser(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        UUID groupId = UUID.fromString(req.get("groupId"));
        User user = userRepo.findByEmail(email).orElseThrow();
        Group group = groupRepo.findById(groupId).orElseThrow();

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(user);
        memberRepo.save(member);

        return ResponseEntity.ok("User invited successfully");
    }

    //this returns all the groups that user belongs to
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getUserGroups(@PathVariable UUID userId) {
        List<GroupMember> memberships = memberRepo.findByUserId(userId);
        List<Group> groups = memberships.stream()
                .map(GroupMember::getGroup)
                .collect(Collectors.toList());
        return ResponseEntity.ok(groups);
    }
}
