package com.aspira.backend.service;

import com.aspira.backend.dto.SavedPostDTO;
import com.aspira.backend.exception.ResourceNotFoundException;
import com.aspira.backend.model.Post;
import com.aspira.backend.model.SavedPost;
import com.aspira.backend.model.User;
import com.aspira.backend.repository.PostRepository;
import com.aspira.backend.repository.SavedPostRepository;
import com.aspira.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public SavedPostDTO savePost(SavedPostDTO savedPostDTO) {
        // Check if the user exists
        User user = userRepository.findById(savedPostDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + savedPostDTO.getUserId()));

        // Check if the post exists
        Post post = postRepository.findById(savedPostDTO.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + savedPostDTO.getPostId()));

        // Create a new SavedPost entity
        SavedPost savedPost = new SavedPost();
        savedPost.setUser(user);
        savedPost.setPost(post);
        savedPost.setCategory(savedPostDTO.getCategory() != null ? savedPostDTO.getCategory() : "Uncategorized");

        // Save the SavedPost entity to the database
        SavedPost createdSavedPost = savedPostRepository.save(savedPost);

        // Convert the SavedPost entity to DTO and return it
        return convertToDTO(createdSavedPost);
    }

    public List<SavedPostDTO> getSavedPostsByUser(Long userId) {
        // Check if the user exists
        List<SavedPost> savedPosts = savedPostRepository.findByUserUserId(userId);
        return savedPosts.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteSavedPost(Long savedPostId) {
        // Check if the saved post exists
        if (!savedPostRepository.existsById(savedPostId)) {
            throw new ResourceNotFoundException("Saved post not found with id: " + savedPostId);
        }
        // Delete the saved post from the database
        savedPostRepository.deleteById(savedPostId);
    }

    @Transactional
    public SavedPostDTO updateSavedPostCategory(Long savedPostId, String newCategory) {
        // Check if the saved post exists
        SavedPost savedPost = savedPostRepository.findById(savedPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved post not found with id: " + savedPostId));

        // Update the category of the saved post
        savedPost.setCategory(newCategory);

        // Save changes to the database
        SavedPost updatedSavedPost = savedPostRepository.save(savedPost);

        // Convert the updated entity to DTO and return it
        return convertToDTO(updatedSavedPost);
    }

    private SavedPostDTO convertToDTO(SavedPost savedPost) {
        // Convert SavedPost entity to DTO
        SavedPostDTO dto = new SavedPostDTO();
        dto.setSavedPostId(savedPost.getSavedPostId());
        dto.setUserId(savedPost.getUser().getUserId());
        dto.setPostId(savedPost.getPost().getPostId());
        dto.setCategory(savedPost.getCategory());
        return dto;
    }
}

