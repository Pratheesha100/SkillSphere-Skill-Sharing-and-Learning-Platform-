package com.aspira.backend.controllers;

import com.aspira.backend.dto.MediaDTO;
import com.aspira.backend.service.MediaService;
import com.aspira.backend.service.UserService;
import com.aspira.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;
    private final UserService userService;

    // Upload a new media file (authenticated user)
    @PostMapping("/upload")
    public ResponseEntity<MediaDTO> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("postId") Long postId,
            @RequestParam("mediaType") String mediaType) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        // Optionally, you can check if the user is the owner of the post before allowing upload
        MediaDTO uploadedMedia = mediaService.uploadMedia(file, postId, mediaType, user.getUserId());
        return new ResponseEntity<>(uploadedMedia, HttpStatus.CREATED);
    }

    // Get all media files associated with a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<MediaDTO>> getMediaByPost(@PathVariable Long postId) {
        List<MediaDTO> mediaList = mediaService.getMediaByPostId(postId);
        return ResponseEntity.ok(mediaList);
    }
}

