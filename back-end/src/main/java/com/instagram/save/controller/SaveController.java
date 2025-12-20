package com.instagram.save.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.save.model.service.SaveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/save")
public class SaveController {

    private final SaveService saveService;
    private final JwtUtil jwtUtil;

    @GetMapping("/list")
    public ResponseEntity<List<Integer>> getLikeList(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("loginUserId : {}", loginUserId);
            List<Integer> result = saveService.getSavePostId(loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkSave(@RequestHeader("Authorization") String authHeader,
                                             @RequestParam int postId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            boolean isSave = saveService.checkSave(postId, loginUserId);
            return ResponseEntity.ok(isSave);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<?> addSave(@RequestHeader("Authorization") String authHeader,
                                     @RequestParam int postId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("postId : {}, loginUserId : {}", postId, loginUserId);
            boolean result = saveService.addSave(postId, loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteSave(@RequestHeader("Authorization") String authHeader,
                                        @RequestParam int postId) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("postId : {}, loginUserId : {}", postId, loginUserId);
            boolean result = saveService.deleteSave(postId, loginUserId);
            log.info("result : {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Integer>> getSavesByUserId(@PathVariable("userId") int userId) {
        List<Integer> saves = saveService.getSavesByUserId(userId);
        return ResponseEntity.ok(saves);
    }
}
