package com.aspira.backend.controllers;

import com.aspira.backend.dto.MediaDTO;
import com.aspira.backend.service.MediaService;
import com.aspira.backend.service.UserService;
import com.aspira.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;
    private final UserService userService;

    @Value("${media.upload-dir:uploads/}") // Inject the upload directory path
    private String uploadDir;

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

    // Serve uploaded files
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            // Extract the actual filename if a full path is inadvertently passed
            String actualFilename = Paths.get(filename).getFileName().toString();

            Path fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = fileStorageLocation.resolve(actualFilename).normalize(); // Use actualFilename
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = null;
                try {
                    contentType = Files.probeContentType(filePath);
                } catch (IOException e) {
                    // log error or handle
                }
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                // You might want to log this or return a specific error for file not found
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException ex) {
            // You might want to log this or return a specific error
            return ResponseEntity.badRequest().build();
        }
    }
}

