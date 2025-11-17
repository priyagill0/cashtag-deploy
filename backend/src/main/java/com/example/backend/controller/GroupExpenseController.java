package com.example.backend.controller;

import com.example.backend.model.GroupExpense;
import com.example.backend.model.SharedExpense;
import com.example.backend.model.Group;
import com.example.backend.model.User;
import com.example.backend.repository.GroupExpenseRepository;
import com.example.backend.repository.GroupRepository;
import com.example.backend.repository.SharedExpenseRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.model.GroupMember;
import com.example.backend.repository.GroupMemberRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.stream.Collectors; 

@RestController
@RequestMapping("/api/group-expense")
@CrossOrigin(origins = "http://localhost:3000")
public class GroupExpenseController {

    private final GroupExpenseRepository groupExpenseRepository;
    private final GroupRepository groupRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private SharedExpenseRepository sharedExpenseRepository;
    @Autowired private GroupMemberRepository memberRepo;
    
    public GroupExpenseController( GroupExpenseRepository groupExpenseRepository, GroupRepository groupRepository) {
        this.groupExpenseRepository = groupExpenseRepository;
        this.groupRepository = groupRepository;
        }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserExpenses(@PathVariable UUID userId) {
        try {
            // Find all groups where user is a member
            List<GroupMember> memberships = memberRepo.findByUserId(userId);
        
            
            // Get all group IDs
            List<UUID> groupIds = memberships.stream()
                .map(gm -> gm.getGroup().getId())
                .collect(Collectors.toList());
            
            // Also get groups owned by user
            List<Group> ownedGroups = groupRepository.findByOwnerId(userId);
            groupIds.addAll(ownedGroups.stream()
                .map(Group::getId)
                .collect(Collectors.toList()));
            
            // Remove duplicates
            groupIds = groupIds.stream().distinct().collect(Collectors.toList());
            
            // Get all expenses from these groups
            List<GroupExpense> allExpenses = new ArrayList<>();
            for (UUID groupId : groupIds) {
                allExpenses.addAll(groupExpenseRepository.findByGroupId(groupId));
            }
            
            // Sort by date descending
            allExpenses.sort((a, b) -> b.getDate().compareTo(a.getDate()));
            
            return ResponseEntity.ok(allExpenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    // expenses for a group
    @GetMapping("/group/{groupId}")
    public List<GroupExpense> getGroupExpenses(@PathVariable UUID groupId) {
        return groupExpenseRepository.findByGroupId(groupId);
    }

    // Add a new expense to that speicifc group 
   @PostMapping("/group/{groupId}/add")
    public ResponseEntity<?> addGroupExpense(
        @PathVariable UUID groupId,
        @RequestBody Map<String, Object> total) {

        //checking first if the group exists
        try {
            Group group = groupRepository.findById(groupId).orElseThrow(() -> new RuntimeException("Group not found"));

         //who paid for the speicifc item, tracking so we can split later
            UUID paidByUserId = UUID.fromString((String) total.get("paidByUserId"));
            User paidBy = userRepository.findById(paidByUserId).orElseThrow();

            GroupExpense expense = new GroupExpense();
            expense.setDescription((String) total.get("description"));
            expense.setTotal(((Number) total.get("total")).doubleValue());
            expense.setDate(LocalDate.parse((String) total.get("date")));
            expense.setGroup(group);
            expense.setPaidBy(paidBy);

            expense.setCategory((String) total.get("category"));
           
            //users should be able to login and see their history of expenses.
            GroupExpense savedExpense = groupExpenseRepository.save(expense);

            List<Map<String, Object>> sharesData = (List<Map<String, Object>>) total.get("shares");

            List<SharedExpense> shares = new ArrayList<>();

            //has the item been for 
            for (Map<String, Object> shareData : sharesData) {
                UUID userId = UUID.fromString((String) shareData.get("userId"));
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                SharedExpense share = new SharedExpense();
                share.setExpense(savedExpense);
                share.setUser(user);
                share.setDebt(((Number) shareData.get("debt")).doubleValue());
                share.setSettled(false);

                shares.add(share);
            }

            sharedExpenseRepository.saveAll(shares);
            savedExpense.setShares(shares);

            return ResponseEntity.ok(savedExpense);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
        }

    
    // Get a single expense with all its shares
    @GetMapping("/{expenseId}")
    public ResponseEntity<?> getExpenseDetails(@PathVariable UUID expenseId) {
        try {
            GroupExpense expense = groupExpenseRepository.findById(expenseId).orElseThrow(() -> new RuntimeException("Expense not found"));
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // settled debts
    @PutMapping("/share/{shareId}/settle")
    public ResponseEntity<?> settleShare(@PathVariable UUID shareId) {
        try {
            SharedExpense share = sharedExpenseRepository.findById(shareId).orElseThrow(() -> new RuntimeException("Share not found"));
            
            share.setSettled(true);
            sharedExpenseRepository.save(share);
            
            return ResponseEntity.ok(share);
        } 
        catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    //Balance for users 
    @GetMapping("/group/{groupId}/user/{userId}/balance")
    public ResponseEntity<?> getUserBalance(
            @PathVariable UUID groupId,
            @PathVariable UUID userId) {
        try {
            List<GroupExpense> expenses = groupExpenseRepository.findByGroupId(groupId);
            
            double totalOwed = 0.0;  // What user owes to others
            double totalOwedToUser = 0.0;  // What others owe to user
            
            for (GroupExpense expense : expenses) {
                // If this user paid
                if (expense.getPaidBy().getId().equals(userId)) {
                    // Add what others owe this user
                    for (SharedExpense share : expense.getShares()) {
                        if (!share.getUser().getId().equals(userId) && !share.isSettled()) {
                            totalOwedToUser += share.getDebt();
                        }
                    }
                }
                
                // If this user has a share in the expense
                for (SharedExpense share : expense.getShares()) {
                    if (share.getUser().getId().equals(userId) && !share.isSettled()) {
                        totalOwed += share.getDebt();
                    }
                }
            }
            
            Map<String, Object> balance = new HashMap<>();
            balance.put("totalOwed", totalOwed);  // User owes this much
            balance.put("totalOwedToUser", totalOwedToUser);  // Others owe user this much
            balance.put("netBalance", totalOwedToUser - totalOwed);  // +ve if user is owed or -ve if user in debt
            
            return ResponseEntity.ok(balance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // who ows who
    @GetMapping("/group/{groupId}/balances")
    public ResponseEntity<?> getGroupBalances(@PathVariable UUID groupId) {
        try {
            List<GroupExpense> expenses = groupExpenseRepository.findByGroupId(groupId);
            Map<String, Map<String, Double>> balances = new HashMap<>();
            
            for (GroupExpense expense : expenses) {
                User paidBy = expense.getPaidBy();
                for (SharedExpense share : expense.getShares()) {
                    if (!share.isSettled() && !share.getUser().getId().equals(paidBy.getId())) {
                        String debtor = share.getUser().getFirstname();
                        String creditor = paidBy.getFirstname();
                        
                        balances.putIfAbsent(debtor, new HashMap<>());
                        balances.get(debtor).put(creditor, 
                        balances.get(debtor).getOrDefault(creditor, 0.0) + share.getDebt());
                    }
                }
            }
            
            return ResponseEntity.ok(balances);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    // delete an expense (and all its shares via cascade)
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<?> deleteExpense(@PathVariable UUID expenseId) {
        try {
            groupExpenseRepository.deleteById(expenseId);
            return ResponseEntity.ok("Expense deleted");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    //update expense similar to expense controller but this time update shares too 
    @PutMapping("/{expenseId}")
    public ResponseEntity<?> updateExpense( @PathVariable UUID expenseId, @RequestBody Map<String, Object> total) {

    try {
        GroupExpense expense = groupExpenseRepository.findById(expenseId).orElseThrow();
        // Update expense fields
        expense.setDescription((String) total.get("description"));
        expense.setTotal(((Number) total.get("total")).doubleValue());
        expense.setCategory((String) total.get("category"));
        expense.setDate(LocalDate.parse((String) total.get("date")));

        //Update shares if needed
        List<Map<String, Object>> sharesData = (List<Map<String, Object>>) total.get("shares");
        if (sharesData != null) {
            List<SharedExpense> updatedShares = new ArrayList<>();
            for (Map<String, Object> shareData : sharesData) {
                UUID userId = UUID.fromString((String) shareData.get("userId"));
                User user = userRepository.findById(userId).orElseThrow();

                SharedExpense share = expense.getShares().stream()
                        .filter(s -> s.getUser().getId().equals(userId))
                        .findFirst()
                        .orElse(new SharedExpense());

                share.setExpense(expense);
                share.setUser(user);
                share.setDebt(((Number) shareData.get("debt")).doubleValue());
                share.setSettled(false);
                updatedShares.add(share);
            }
            sharedExpenseRepository.saveAll(updatedShares);
            expense.setShares(updatedShares);
        }

        // Save it
        GroupExpense savedExpense = groupExpenseRepository.save(expense);
        return ResponseEntity.ok(savedExpense);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.badRequest().body("Error: " + e.getMessage());
    }
}


}