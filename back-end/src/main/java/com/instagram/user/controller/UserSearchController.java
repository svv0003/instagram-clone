package com.instagram.user.controller;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserSearchController {

    private final UserService userService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<User> getPostsByUserId(@PathVariable int userId) {
        try {
            User user = userService.getUserByUserId(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e){
            log.error("프로필 조회 실패 : {}", e.getMessage());
            return  ResponseEntity.status(401).body(null);
        }
    }
    // TODO 9: 유저 검색 API
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("q") String query) {
        try {
            List<User> result = userService.searchUsers(query);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ArrayList<>());
        }
    }

    // TODO 10: 유저네임으로 조회 API
    @GetMapping("/username/{userName}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String userName) {
        try {
            User u = userService.getUserByUserName(userName);
            if (u == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(u);
        } catch (Exception e) {
            log.error("유저 조회 실패: {}",e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}