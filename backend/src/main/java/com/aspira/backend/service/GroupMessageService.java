package com.aspira.backend.service;

import com.aspira.backend.model.GroupMessage;
import com.aspira.backend.model.UserGroup;
import com.aspira.backend.model.User;
import com.aspira.backend.repository.GroupMessageRepository;
import com.aspira.backend.repository.UserGroupRepository;
import com.aspira.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GroupMessageService {
    @Autowired
    private GroupMessageRepository groupMessageRepository;
    @Autowired
    private UserGroupRepository userGroupRepository;
    @Autowired
    private UserRepository userRepository;

    public List<GroupMessage> getMessagesByGroupId(Long groupId) {
        return groupMessageRepository.findByGroup_GroupIdOrderBySentAtAsc(groupId);
    }

    public Optional<GroupMessage> getMessageById(Long messageId) {
        return groupMessageRepository.findById(messageId);
    }

    public GroupMessage sendMessage(Long groupId, Long senderId, String content) {
        UserGroup group = userGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        GroupMessage message = new GroupMessage();
        message.setGroup(group);
        message.setSender(sender);
        message.setContent(content);
        message.setSentAt(java.time.LocalDateTime.now());
        return groupMessageRepository.save(message);
    }
} 