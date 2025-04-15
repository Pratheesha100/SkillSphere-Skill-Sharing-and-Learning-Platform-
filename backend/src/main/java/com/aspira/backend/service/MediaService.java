package com.aspira.backend.service;

import com.aspira.backend.dto.MediaDTO;
import com.aspira.backend.exception.ResourceNotFoundException;
import com.aspira.backend.model.Media;
import com.aspira.backend.model.MediaType;
import com.aspira.backend.model.Post;
import com.aspira.backend.repository.MediaRepository;
import com.aspira.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final PostRepository postRepository;

    private final String UPLOAD_DIR = "uploads/"; // Directory to store uploaded files

    @Transactional
    public MediaDTO uploadMedia(MultipartFile file, Long postId, String mediaType) throws IOException {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        // Save file to server
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File destinationFile = new File(UPLOAD_DIR + fileName);
        destinationFile.getParentFile().mkdirs(); // Create directories if they don't exist
        file.transferTo(destinationFile);

        // Save media info in database
        Media media = new Media();
        media.setMediaUrl(UPLOAD_DIR + fileName);
        media.setMediaType(MediaType.valueOf(mediaType));
        media.setPost(post);

        Media savedMedia = mediaRepository.save(media);
        return convertToDTO(savedMedia);
    }

    public List<MediaDTO> getMediaByPostId(Long postId) {
        List<Media> mediaList = mediaRepository.findByPostPostId(postId);
        return mediaList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MediaDTO convertToDTO(Media media) {
        MediaDTO dto = new MediaDTO();
        dto.setMediaId(media.getMediaId());
        dto.setMediaUrl(media.getMediaUrl());
        dto.setMediaType(media.getMediaType().name());
        dto.setPostId(media.getPost().getPostId());
        return dto;
    }
}

