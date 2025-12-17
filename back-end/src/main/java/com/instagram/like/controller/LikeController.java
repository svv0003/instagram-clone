package com.instagram.like.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.follow.model.service.FollowService;
import com.instagram.like.model.service.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
public class LikeController {

    private final LikeService likeService;
    private final JwtUtil jwtUtil;

    @GetMapping("/list")
    public ResponseEntity<List<Integer>> getLikeList(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("loginUserId : {}", loginUserId);
            List<Integer> result = likeService.getLikePostId(loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkFollowing(@RequestHeader("Authorization") String authHeader,
                                                  @RequestParam int postId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            boolean isLike = likeService.checkLike(postId, loginUserId);
            return ResponseEntity.ok(isLike);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> getLikeCount(@RequestParam int postId) {
        try {
            log.info("feedUserId : {}", postId);
            int result = likeService.getLikes(postId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFollowing(@RequestHeader("Authorization") String authHeader,
                                          @RequestParam int postId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("postId : {}, loginUserId : {}", postId, loginUserId);
            boolean result = likeService.addLike(postId, loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFollowing(@RequestHeader("Authorization") String authHeader,
                                             @RequestParam int postId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("postId : {}, loginUserId : {}", postId, loginUserId);
            boolean result = likeService.deleteLike(postId, loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
