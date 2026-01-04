package com.instagram.follow.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.follow.model.dto.Follow;
import com.instagram.follow.model.service.FollowService;
import com.instagram.user.model.dto.User;
import com.instagram.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private final SimpMessagingTemplate messagingTemplate; // WebSocket 메세지 전송
    private final UserService userService;


    @GetMapping("/list/following/userId")
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

    @GetMapping("/list/following")
    public ResponseEntity<List<User>> getFollowingUserList(@RequestParam int userId) {
        try {
            log.info("userId : {}", userId);
            List<User> result = followService.getFollowingUserList(userId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/list/follower")
    public ResponseEntity<List<User>> getFollowerUserList(@RequestParam int userId) {
        try {
            log.info("userId : {}", userId);
            List<User> result = followService.getFollowerUserList(userId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkFollowing(@RequestHeader("Authorization") String authHeader,
                                                  @RequestParam int userId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            boolean isFollowing = followService.checkFollowing(userId, loginUserId);
            return ResponseEntity.ok(isFollowing);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getFollowerCount(@RequestParam int userId) {
        try {
            log.info("userId : {}", userId);
            int resultFollowing = followService.getFollowingUsers(userId);
            int resultFollower = followService.getFollowerUsers(userId);
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
            User loginUser = userService.getUserByUserId(loginUserId);
            String loginUserName = loginUser.getUserName();
            log.info("userId : {}, loginUserId : {}", userId, loginUserId);
            boolean result = followService.addFollowing(userId, loginUserId);
            log.info("result : {}", result);

            Map<String, Object> notification = new HashMap<>();
            notification.put("id", 1);
            notification.put("type", "FOLLOW");
            notification.put("sendUserid", loginUserId);
            notification.put("sendUserName", loginUserName);
            notification.put("receiveUserId", userId);
            notification.put("timestamp", System.currentTimeMillis());
            messagingTemplate.convertAndSendToUser(String.valueOf(userId), "/queue/notifications", notification);
//            messagingTemplate.convertAndSend("/queue/notifications", notification);
            log.info("String.valueOf(userId) : {}, loginUserName : {}, userId : {}", userId, loginUserName, userId);
            log.info("팔로우 및 WebSocket 알림 전송 완료");

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
