package com.aspira.backend.controllers;

import com.aspira.backend.dto.PostDTO;
import com.aspira.backend.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indicates that this class is a REST controller
@RequestMapping("/api/posts") // Base URL for all endpoints in this controller
public class PostController {

    private final PostService postService;

    // Constructor injection for PostService
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Create a new post
    @PostMapping("/{userId}")
    public ResponseEntity<PostDTO> createPost(
            @PathVariable Long userId,
            @Valid @RequestBody PostDTO postDTO) {
        PostDTO createdPost = postService.createPost(userId, postDTO);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    // Search posts by keyword (title or content)
    @GetMapping("/search")
    public ResponseEntity<List<PostDTO>> searchPosts(@RequestParam String keyword) {
        List<PostDTO> posts = postService.searchPosts(keyword);
        return ResponseEntity.ok(posts);
    }

    // Get all posts
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }

    // Get posts by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDTO>> getPostsByUserId(@PathVariable Long userId) {
        List<PostDTO> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    // Get a post by ID
    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long postId) {
        PostDTO postDTO = postService.getPostById(postId);
        return ResponseEntity.ok(postDTO);
    }

    // Get posts by hashtag (case-insensitive)
    @GetMapping("/search/hashtag")
    public ResponseEntity<List<PostDTO>> searchByHashtag(
            @RequestParam String hashtag) {
        return ResponseEntity.ok(
                postService.searchByHashtag(hashtag));
    }

    // Get posts by category (case-insensitive)
    @GetMapping("/category/{category}")
    public ResponseEntity<List<PostDTO>> getPostsByCategory(@PathVariable String category) {
        List<PostDTO> posts = postService.getPostsByCategory(category);
        return ResponseEntity.ok(posts);
    }

    // Get posts by media type (e.g., image, video)
    @PutMapping("/{postId}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long postId,
            @RequestParam Long userId,
            @Valid @RequestBody PostDTO postDTO) {

        PostDTO updatedPost = postService.updatePost(postId, userId, postDTO);
        return ResponseEntity.ok(updatedPost);
    }

    // Delete a post
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long postId,
            @RequestParam Long userId) {

        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }

    // Get ranked posts (sorted by rank score)
    @GetMapping("/rank")
    public ResponseEntity<List<PostDTO>> getRankedPosts() {
        List<PostDTO> rankedPosts = postService.getRankedPosts();
        return ResponseEntity.ok(rankedPosts);
    }
}
