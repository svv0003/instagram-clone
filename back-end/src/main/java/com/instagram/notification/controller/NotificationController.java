package com.instagram.notification.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.notification.model.dto.Notification;
import com.instagram.notification.model.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notification")
public class NotificationController {

    private final JwtUtil jwtUtil;
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications(
        @RequestHeader("Authorization") String authHeader) {
            try {
                String token = authHeader.substring(7);
                int loginUserId = jwtUtil.getUserIdFromToken(token);
                log.info("loginUserId : {}", loginUserId);
                List<Notification> result = notificationService.getMyNotifications(loginUserId);
                log.info("result : {}", result);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(500).body(null);
            }
    }

    @PatchMapping("/{notificationId}")
    public ResponseEntity<?> updateStatus(
        @RequestHeader("Authorization") String authHeader,
        @PathVariable int notificationId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("loginUserId : {}", loginUserId);
            log.info("notificationId : {}", notificationId);
            notificationService.updateStatus(loginUserId, notificationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
