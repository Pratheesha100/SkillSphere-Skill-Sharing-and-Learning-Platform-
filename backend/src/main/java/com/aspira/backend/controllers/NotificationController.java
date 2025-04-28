package com.aspira.backend.controllers;

import com.aspira.backend.dto.NotificationDTO;
import com.aspira.backend.service.NotificationService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationDTO> createNotification(@RequestBody NotificationDTO notificationDTO) {
        NotificationDTO createdNotification = notificationService.createNotification(notificationDTO);

                createdNotification.add(linkTo(methodOn(NotificationController.class)
                .getNotificationsByUser(createdNotification.getUserId()))
                .withRel("user-notifications"));

                createdNotification.add(linkTo(methodOn(NotificationController.class)
                .markAsRead(createdNotification.getNotificationId()))
                .withRel("mark-as-read"));

                createdNotification.add(linkTo(methodOn(NotificationController.class)
                .deleteNotification(createdNotification.getNotificationId()))
                .withRel("delete-notification"));

        return new ResponseEntity<>(createdNotification, HttpStatus.CREATED);
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUser(@PathVariable Long userId) {
        List<NotificationDTO> notifications = notificationService.getNotificationsByUserId(userId);
         notifications.forEach(this::addLinks);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.noContent().build();
    }


    // Helper method to add HATEOAS links to a NotificationDTO
    private void addLinks(NotificationDTO notification) {
        notification.add(linkTo(methodOn(NotificationController.class)
                .getNotificationsByUser(notification.getUserId()))
                .withRel("user-notifications"));

        notification.add(linkTo(methodOn(NotificationController.class)
                .markAsRead(notification.getNotificationId()))
                .withRel("mark-as-read"));

        notification.add(linkTo(methodOn(NotificationController.class)
                .deleteNotification(notification.getNotificationId()))
                .withRel("delete-notification"));
    }

}
