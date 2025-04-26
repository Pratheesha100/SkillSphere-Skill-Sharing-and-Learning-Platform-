package com.aspira.backend.controllers;

import com.aspira.backend.dto.SavedPostDTO;
import com.aspira.backend.service.SavedPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-posts")
@RequiredArgsConstructor
public class SavedPostController {

    private final SavedPostService savedPostService;

    // Get all saved posts for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedPostDTO>> getSavedPostsByUser(@PathVariable Long userId) {
        List<SavedPostDTO> savedPosts = savedPostService.getSavedPostsByUser(userId);
        return ResponseEntity.ok(savedPosts);
    }

    // Delete a specific saved post by ID
    @DeleteMapping("/{savedPostId}")
    public ResponseEntity<Void> deleteSavedPosts(@PathVariable Long savedPostId) {
        savedPostService.deleteSavedPost(savedPostId);
        return ResponseEntity.noContent().build();
    }

    // Create a new saved post
    @PostMapping
    public ResponseEntity<SavedPostDTO> savePost(@RequestBody SavedPostDTO savedPostDTO) {
        SavedPostDTO createdSavedPost = savedPostService.savePost(savedPostDTO);
        return new ResponseEntity<>(createdSavedPost, HttpStatus.CREATED);
    }

    // Update the category of a saved post
    @PutMapping("/{savedPostId}/category")
    public ResponseEntity<SavedPostDTO> updateSavedPostsCategory(
            @PathVariable Long savedPostId,
            @RequestParam String newCategory) {
        SavedPostDTO updatedSavedPost = savedPostService.updateSavedPostCategory(savedPostId, newCategory);
        return ResponseEntity.ok(updatedSavedPost);
    }
}
