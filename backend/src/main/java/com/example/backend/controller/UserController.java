package com.example.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
//import java.util.UUID;

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
}
// package com.example.backend.controller;

// import com.example.backend.model.User;
// import com.example.backend.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;

// import java.util.UUID;

// @RestController
// @RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:3000")
// public class UserController {
    
//     @Autowired
//     private UserRepository userRepository;
    
//     @PostMapping
//     public ResponseEntity<User> createUser(@RequestBody UserRequest request) {
//         try {
//             // Convert String UUID to UUID object
//             UUID userId = UUID.fromString(request.getId());
            
//             User user = new User(
//                 userId,
//                 request.getEmail(),
//                 request.getFirstname(),
//                 request.getLastname()
//             );
            
//             User savedUser = userRepository.save(user);
//             return ResponseEntity.ok(savedUser);
            
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().build();
//         } catch (Exception e) {
//             e.printStackTrace();
//             return ResponseEntity.status(500).build();
//         }
//     }
    
//     // Helper class to receive JSON
//     public static class UserRequest {
//         private String id;
//         private String email;
//         private String firstname;
//         private String lastname;
        
//         // Getters & Setters
//         public String getId() { return id; }
//         public void setId(String id) { this.id = id; }
        
//         public String getEmail() { return email; }
//         public void setEmail(String email) { this.email = email; }
        
//         public String getFirstname() { return firstname; }
//         public void setFirstname(String firstname) { this.firstname = firstname; }
        
//         public String getLastname() { return lastname; }
//         public void setLastname(String lastname) { this.lastname = lastname; }
//     }
// }