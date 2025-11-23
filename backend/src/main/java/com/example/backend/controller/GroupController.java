package com.example.backend.controller;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import com.example.backend.service.BadgeService;
import com.example.backend.service.StreakService;
import com.example.backend.service.BadgeBackfillService;



@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupController {

    //inject the repositories to interact with the database
    @Autowired private GroupRepository groupRepo;
    @Autowired private GroupMemberRepository memberRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private BadgeService badgeService;
    @Autowired private StreakService streakService;
    @Autowired private BadgeBackfillService badgeBackfillService;
    
    //this creates a new group and automatically adds the creator as a member.
    @PostMapping("/create")
    public ResponseEntity<Group> createGroup(@RequestBody Map<String, String> req) {
        System.out.println("Incoming request body: " + req);
        
         //extract group name and owner ID from the frontend request
        String name = req.get("name");
        UUID ownerId = UUID.fromString(req.get("ownerId"));

        // Find the owner in the database
        //backend is null?
        User owner = userRepo.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found: " + ownerId));
    
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

        // Award JOIN_GROUP badge to the owner of the group
        badgeService.checkAndAwardBadge(
            owner.getId(),
            BadgeEventType.JOIN_GROUP,
            1
        );
        return ResponseEntity.ok(saved); //return the saved group
    }

   @PostMapping("/users/sync")
    public ResponseEntity<User> syncUser(@RequestBody Map<String,String> req) {
        try {
            UUID supabaseId = UUID.fromString(req.get("id"));
            String email = req.get("email");
            String firstName = req.get("firstName");
            String lastName = req.get("lastName"); 
            
            // Check if user already exists
            Optional<User> existingUser = userRepo.findById(supabaseId);
            
            User user;
            if (existingUser.isPresent()) {
                // User exists - update it
                user = existingUser.get();
                user.setEmail(email);
                user.setFirstname(firstName);
                user.setLastname(lastName);
            } else {
                // New user - create it
                user = new User();
                user.setId(supabaseId);
                user.setEmail(email);
                user.setFirstname(firstName);
                user.setLastname(lastName);
            }

            String lastLoginStr = req.get("last_sign_in_at");

            OffsetDateTime odt = OffsetDateTime.parse(lastLoginStr);
            LocalDate lastLogin = odt.toLocalDate();

            streakService.handleLogin(supabaseId, lastLogin);


            userRepo.save(user);

            badgeBackfillService.checkAllBadgesForUser(supabaseId);
            System.out.println("ran backfill : " + user.getId());
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    //adds another user (member) to the group
    @PostMapping("/invite")
    public ResponseEntity<String> inviteUser(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        UUID groupId = UUID.fromString(req.get("groupId"));
        // UUID inviterId = UUID.fromString(req.get("inviterId")); // need inviterId from frontend
        User user = userRepo.findByEmail(email).orElseThrow();
        Group group = groupRepo.findById(groupId).orElseThrow();

         // Check if user is already a member
        boolean knownMember = memberRepo.findByGroupId(groupId).stream()
            .anyMatch(m -> m.getUser().getId().equals(user.getId()));
        
        if (knownMember) {
            return ResponseEntity.badRequest().body("User is already a member");
        }
        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(user);
        memberRepo.save(member);

        // Award the JOIN_GROUP badge to the user who joined
        badgeService.checkAndAwardBadge(
            user.getId(),
            BadgeEventType.JOIN_GROUP,
            1
        );
        
        return ResponseEntity.ok("User invited successfully");
    }

    //this returns all the groups that user belongs to
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Group>> getUserGroups(@PathVariable UUID userId) {
        // groups where the user is the owner
        List<Group> ownedGroups = groupRepo.findByOwnerId(userId);

        // groups where the user is a member
        List<Group> memberGroups = memberRepo.findByUserId(userId)
                .stream()
                .map(GroupMember::getGroup)
                .collect(Collectors.toList());

        // Combine both lists and remove duplicates (just in case)
        Set<Group> allGroups = new HashSet<>();
        allGroups.addAll(ownedGroups);
        allGroups.addAll(memberGroups);

        // Award JOIN_GROUP badge if the user belongs to ANY group.
        if (!allGroups.isEmpty()) {
            badgeService.checkAndAwardBadge(userId, BadgeEventType.JOIN_GROUP, 1);
        }
 
        return ResponseEntity.ok(new ArrayList<>(allGroups)); 
    }

    //this returns all members in that group
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<Map<String, Object>>> getGroupMembers(@PathVariable UUID groupId) {
    List<GroupMember> members = memberRepo.findByGroupId(groupId);
    List<Map<String, Object>> response = members.stream().map(member -> {
        Map<String, Object> memberData = new HashMap<>();
        memberData.put("id", member.getId());

        User user = member.getUser();
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getFirstname());
        userData.put("username", user.getLastname());
        userData.put("email", user.getEmail());

        memberData.put("user", userData);
        return memberData;
    }).collect(Collectors.toList());

    return ResponseEntity.ok(response);
        // List<GroupMember> members = memberRepo.findByGroupId(groupId);
        // return ResponseEntity.ok(members);
    }


}

