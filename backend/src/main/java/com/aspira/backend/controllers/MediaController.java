package com.aspira.backend.controllers;

import com.aspira.backend.dto.MediaDTO;
import com.aspira.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    // Upload a new media file
    @PostMapping("/upload")
    public ResponseEntity<MediaDTO> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam("postId") Long postId,
            @RequestParam("mediaType") String mediaType) throws IOException {
        
        MediaDTO uploadedMedia = mediaService.uploadMedia(file, postId, mediaType);
        return new ResponseEntity<>(uploadedMedia, HttpStatus.CREATED);
    }

    // Get all media files associated with a specific post
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<MediaDTO>> getMediaByPost(@PathVariable Long postId) {
        List<MediaDTO> mediaList = mediaService.getMediaByPostId(postId);
        return ResponseEntity.ok(mediaList);
    }
}

