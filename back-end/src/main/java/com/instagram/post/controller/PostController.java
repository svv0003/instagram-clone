package com.instagram.post.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.service.PostService;
import com.instagram.story.model.dto.Story;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.Jar;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<String> createPost(@RequestPart MultipartFile postImage,
                                             @RequestPart String postCaption,
                                             @RequestPart(required = false) String postLocation,
                                             @RequestHeader("Authorization") String authHeader) {
        /*
        JWT 토큰(백엔드 인증 기반)으로 현재 로그인 사용자 id 가져오기
        import org.springframework.security.core.Authentication;
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        int currentUserId = Integer.parseInt(authentication.getName());
        post.setUserId(currentUserId);
         */
        // 맨 앞 "Bearer "만 제거하고 추출한다.
        String token = authHeader.substring(7);
        log.info("token: {}", token);
        // token에서 userId만 추출한다.
        int currentUserId = jwtUtil.getUserIdFromToken(token);
        log.info("currentUserId: {}", currentUserId);

        boolean success = postService.createPost(postImage, postCaption, postLocation, currentUserId);
        log.info("success: {}", success);
        if (success) {
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        log.info("token: {}", token);
        int currentUserId = jwtUtil.getUserIdFromToken(token);
        List<Post> posts = postService.getAllPosts(currentUserId);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Integer>> getPostsByUserId(@PathVariable("userId") int userId) {
        List<Integer> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Boolean> addLike(@PathVariable("postId") int postId,
                                           @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            int currentUserId = jwtUtil.getUserIdFromToken(token);
            boolean result = postService.addLike(postId, currentUserId);
            return ResponseEntity.ok(result);
        }  catch (Exception e) {
            log.error("좋아요 실패 : {}", e.getMessage());
            return ResponseEntity.badRequest().body(false);
        }
    }

    @DeleteMapping("/{postId}/like")
    public ResponseEntity<Boolean> deleteLike(@PathVariable("postId") int postId,
                                              @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            int currentUserId = jwtUtil.getUserIdFromToken(token);
            boolean result = postService.deleteLike(postId, currentUserId);
            return ResponseEntity.ok(result);
        }  catch (Exception e) {
            log.error("좋아요 취소 실패 : {}", e.getMessage());
            return ResponseEntity.badRequest().body(false);
        }
    }

    @GetMapping("{postId}")
    public ResponseEntity<Post> getPostById(@PathVariable("postId") int postId) {
        try {
            log.info("postId : {}", postId);
            Post post = postService.getPostById(postId);
            log.info("post : {}", post);
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            log.error("포스팅 조회 실패 : {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("image/{postId}")
    public ResponseEntity<String> getPostImageByPostId(@PathVariable("postId") int postId) {
        try {
            log.info("postId : {}", postId);
            String postImage = postService.getPostImage(postId);
            log.info("postImage : {}", postImage);
            return ResponseEntity.ok(postImage);
        } catch (Exception e) {
            log.error("포스팅 조회 실패 : {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }
}
