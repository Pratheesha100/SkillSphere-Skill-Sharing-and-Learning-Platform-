package com.aspira.backend.service;

import com.aspira.backend.model.User;
import com.aspira.backend.model.UserGroup;
import com.aspira.backend.repository.UserGroupRepository;
import com.aspira.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UserGroupService {
    @Autowired
    private UserGroupRepository groupRepository;
    @Autowired
    private UserRepository userRepository;

    public List<UserGroup> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<UserGroup> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    @Transactional
    public UserGroup createGroup(UserGroup group, Long adminId) {
        User admin = userRepository.findById(adminId)
            .orElseThrow(() -> new RuntimeException("Admin user not found"));
        group.setAdmin(admin);
        group.getMembers().add(admin);
        return groupRepository.save(group);
    }

    @Transactional
    public UserGroup addMember(Long groupId, Long userId, Long adminId) {
        UserGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        if (!group.getAdmin().getUserId().equals(adminId)) {
            throw new RuntimeException("Only the admin can add members");
        }
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        group.getMembers().add(user);
        return groupRepository.save(group);
    }
} 