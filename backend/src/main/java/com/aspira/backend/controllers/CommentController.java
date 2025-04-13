package com.aspira.backend.controllers;

import com.aspira.backend.dto.CommentDTO;
import com.aspira.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // Create a new comment
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO) {
        CommentDTO createdComment = commentService.createComment(commentDTO);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    // Get all comments by a specific post ID
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPost(@PathVariable Long postId) {
        List<CommentDTO> comments = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

   // Delete a specific comment by ID (restricted to creator or post owner)
   @DeleteMapping("/{commentId}")
   public ResponseEntity<Void> deleteComment(
           @PathVariable Long commentId,
           @RequestParam Long userId) {
       
       commentService.deleteComment(commentId, userId);
       return ResponseEntity.noContent().build();
   }

   // Update a specific comment (restricted to creator)
   @PutMapping("/{commentId}")
   public ResponseEntity<CommentDTO> updateComment(
           @PathVariable Long commentId,
           @RequestParam Long userId,
           @RequestParam String updatedContent) {
       
       CommentDTO updatedComment = commentService.updateComment(commentId, userId, updatedContent);
       return ResponseEntity.ok(updatedComment);
   }
}
