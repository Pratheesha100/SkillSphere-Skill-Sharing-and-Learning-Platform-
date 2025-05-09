package com.aspira.backend.controllers;

import com.aspira.backend.model.GroupMessage;
import com.aspira.backend.service.GroupMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups/{groupId}/messages")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, 
            allowedHeaders = "*",
            allowCredentials = "true",
            methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class GroupMessageController {

    @Autowired
    private GroupMessageService groupMessageService;

    @GetMapping
    public ResponseEntity<?> getGroupMessages(@PathVariable Long groupId) {
        try {
            List<GroupMessage> messages = groupMessageService.getMessagesByGroupId(groupId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(
            @PathVariable Long groupId,
            @RequestParam Long senderId,
            @RequestBody Map<String, String> request) {
        try {
            String content = request.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Message content cannot be empty"));
            }

            GroupMessage message = groupMessageService.sendMessage(groupId, senderId, content);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
} 