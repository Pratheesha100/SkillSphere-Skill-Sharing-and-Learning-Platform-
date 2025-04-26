package com.aspira.backend.controllers;

import com.aspira.backend.dto.ReactionDTO;
import com.aspira.backend.service.ReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping
    public ResponseEntity<ReactionDTO> createReaction(@RequestBody ReactionDTO reactionDTO) {
        ReactionDTO createdReaction = reactionService.createReaction(reactionDTO);
        return new ResponseEntity<>(createdReaction, HttpStatus.CREATED);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<ReactionDTO>> getReactionsByPostId(@PathVariable Long postId) {
        List<ReactionDTO> reactions = reactionService.getReactionsByPostId(postId);
        return ResponseEntity.ok(reactions);
    }

    @PutMapping("/{reactionId}")
    public ResponseEntity<ReactionDTO> updateReaction(
            @PathVariable Long reactionId,
            @RequestParam Long userId,
            @RequestParam String newReactionType) {
        
        ReactionDTO updatedReaction = reactionService.updateReaction(reactionId, userId, newReactionType);
        return ResponseEntity.ok(updatedReaction);
    }

    @DeleteMapping("/{reactionId}")
    public ResponseEntity<Void> removeReaction(
            @PathVariable Long reactionId,
            @RequestParam Long userId) {
        
        reactionService.removeReaction(reactionId, userId);
        return ResponseEntity.noContent().build();
    }
}
