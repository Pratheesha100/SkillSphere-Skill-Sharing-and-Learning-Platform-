package com.aspira.backend.service;

import com.aspira.backend.model.Group;
import com.aspira.backend.model.GroupMessage;
import com.aspira.backend.model.User;
import com.aspira.backend.repository.GroupMessageRepository;
import com.aspira.backend.repository.GroupRepository;
import com.aspira.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class GroupMessageService {

    @Autowired
    private GroupMessageRepository groupMessageRepository;

    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public GroupMessage sendMessage(Long groupId, Long senderId, String content) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // Check if sender is a member of the group
        if (!group.getMembers().contains(sender)) {
            throw new RuntimeException("User is not a member of this group");
        }

        GroupMessage message = new GroupMessage();
        message.setGroup(group);
        message.setSender(sender);
        message.setContent(content);
        message.setSentAt(LocalDateTime.now());

        return groupMessageRepository.save(message);
    }

    public List<GroupMessage> getGroupMessages(Long groupId) {
        return groupMessageRepository.findByGroup_GroupIdOrderBySentAtAsc(groupId);
    }
} 