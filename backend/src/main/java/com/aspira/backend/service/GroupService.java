package com.aspira.backend.service;

import com.aspira.backend.model.Group;
import com.aspira.backend.model.User;
import com.aspira.backend.repository.GroupRepository;
import com.aspira.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public List<Group> getGroupsByUserId(Long userId) {
        return groupRepository.findByMembers_UserId(userId);
    }

    @Transactional
    public Group createGroup(Group group, Long adminId) {
        try {
            User admin = userRepository.findById(adminId)
                    .orElseThrow(() -> new RuntimeException("Admin user not found"));

            group.setAdmin(admin);
            group.getMembers().add(admin);
            return groupRepository.save(group);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create group: " + e.getMessage());
        }
    }

    @Transactional
    public Group updateGroup(Long id, Group groupDetails) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        group.setGroupName(groupDetails.getGroupName());
        group.setDescription(groupDetails.getDescription());
        return groupRepository.save(group);
    }

    @Transactional
    public void deleteGroup(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Check if there are any messages or other dependencies
        // Add more specific checks here if needed

        groupRepository.deleteById(id);
    }

    @Transactional
    public Group addMember(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (group.getMembers().stream().anyMatch(m -> m.getUserId().equals(userId))) {
            throw new RuntimeException("User is already a member of this group");
        }

        group.getMembers().add(user);
        return groupRepository.save(group);
    }

    @Transactional
    public Group removeMember(Long groupId, Long userId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (group.getAdmin().getUserId().equals(userId)) {
            throw new RuntimeException("Cannot remove admin from the group");
        }

        group.getMembers().removeIf(m -> m.getUserId().equals(userId));
        return groupRepository.save(group);
    }

    public boolean checkIfUserExists(Long userId) {
        // Assuming you have a UserRepository to interact with the users table
        return userRepository.existsById(userId);
    }
}