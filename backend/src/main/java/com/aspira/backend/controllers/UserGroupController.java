package com.aspira.backend.controller;

import com.aspira.backend.model.UserGroup;
import com.aspira.backend.model.User;
import com.aspira.backend.service.UserGroupService;
import com.aspira.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user-groups")
@CrossOrigin(origins = {"http://localhost:5173"})
public class UserGroupController {
    @Autowired
    private UserGroupService groupService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createGroup(@RequestBody UserGroup group, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }
        UserGroup created = groupService.createGroup(group, userOpt.get().getUserId());
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public List<UserGroup> getAllGroups() {
        return groupService.getAllGroups();
    }

    @PostMapping("/{groupId}/add-member/{userId}")
    public ResponseEntity<?> addMember(@PathVariable Long groupId, @PathVariable Long userId, Authentication authentication) {
        String email = authentication.getName();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }
        try {
            UserGroup updated = groupService.addMember(groupId, userId, userOpt.get().getUserId());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 