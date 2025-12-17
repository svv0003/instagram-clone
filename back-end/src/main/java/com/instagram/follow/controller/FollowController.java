package com.instagram.follow.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.follow.model.dto.Follow;
import com.instagram.follow.model.service.FollowService;
import com.instagram.user.model.dto.User;
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
@RequestMapping("/api/follow")
public class FollowController {

    private final FollowService followService;
    private final JwtUtil jwtUtil;

    @GetMapping("/list")
    public ResponseEntity<List<Integer>> getFollowingList(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("loginUserId : {}", loginUserId);
            List<Integer> result = followService.getFollowingUserId(loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getFollowerCount(@RequestParam int feedUserId) {
        try {
            log.info("feedUserId : {}", feedUserId);
            int resultFollowing = followService.getFollowingUsers(feedUserId);
            int resultFollower = followService.getFollowerUsers(feedUserId);
            log.info("resultFollowing : {}, resultFollower : {}", resultFollowing, resultFollower);
            Map<String, Integer> map = new HashMap<>();
            map.put("resultFollowing", resultFollowing);
            map.put("resultFollower", resultFollower);
            return ResponseEntity.ok(map);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addFollowing(@RequestHeader("Authorization") String authHeader,
                                          @RequestParam int userId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("userId : {}, loginUserId : {}", userId, loginUserId);
            boolean result = followService.addFollowing(userId, loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFollowing(@RequestHeader("Authorization") String authHeader,
                                             @RequestParam int userId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("userId : {}, loginUserId : {}", userId, loginUserId);
            boolean result = followService.deleteFollowing(userId, loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
