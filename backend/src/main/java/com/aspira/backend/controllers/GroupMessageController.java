package com.aspira.backend.controllers;

import com.aspira.backend.dto.GroupMessageDTO;
import com.aspira.backend.service.GroupMessageService;
import com.aspira.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupMessageController {

    private final GroupMessageService messageService;
    private final UserService userService;

    @PostMapping("/{groupId}/messages")
    public ResponseEntity<GroupMessageDTO> sendMessage(
            @PathVariable Long groupId,
            @RequestBody String content,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Fetch user ID from the database using the email
        Long userId = userService.getUserByEmail(userDetails.getUsername()).getUserId();

        // Check if the user is a member of the group
        if (!groupService.isUserMemberOfGroup(groupId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        GroupMessageDTO message = messageService.sendMessage(groupId, userId, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{groupId}/messages")
    public ResponseEntity<List<GroupMessageDTO>> getMessages(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Fetch user ID from the database using the email
        Long userId = userService.getUserByEmail(userDetails.getUsername()).getUserId();

        // Check if the user is a member of the group
        if (!groupService.isUserMemberOfGroup(groupId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<GroupMessageDTO> messages = messageService.getMessages(groupId);
        return ResponseEntity.ok(messages);
    }
}
