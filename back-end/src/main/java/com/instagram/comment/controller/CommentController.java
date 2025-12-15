package com.instagram.comment.controller;

import com.instagram.comment.model.dto.Comment;
import com.instagram.comment.model.dto.CommentResponse;
import com.instagram.comment.model.service.CommentService;
import com.instagram.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final JwtUtil jwtUtil;

    /**
     * 특정 게시물 목록+개수 조회
     * GET /api/posts/{postId}/comments
     * getComments
     */
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> getComments(@PathVariable int postId) {
        try {
            log.info("postId : " + postId);
            CommentResponse result = commentService.getCommentsByPostId(postId);
            log.info("result : " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("댓글 조회 실패 : {}", e.getMessage());
            return  ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * 댓글 작성
     * POST /api/posts/{postId}/comments
     * createComment
     */
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<Boolean> createComment(@PathVariable int postId,
                                                 @RequestHeader("Authorization") String authHeader,
                                                 @RequestBody Comment comment) {
        try {
            String token = authHeader.substring(7);
            int loginUserId = jwtUtil.getUserIdFromToken(token);
            log.info("postId : {} userId : {}", postId, loginUserId);
            boolean result = commentService.createComment(postId, loginUserId, comment.getCommentContent());
            log.info("result : " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("댓글 작성 실패 : {}", e.getMessage());
            return  ResponseEntity.badRequest().body(false);
        }
    }

    /**
     * 댓글 수정
     * PUT /api/comments/{commentId}
     * updateComment
     */
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<Boolean> updateComment(@PathVariable int postId,
                                                 @RequestBody String commentContent) {
        try {
            log.info("postId : {} commentContent : {}", postId, commentContent);
            boolean result = commentService.updateComment(postId, commentContent);
            log.info("result : " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("댓글 수정 실패 : {}", e.getMessage());
            return  ResponseEntity.badRequest().body(false);
        }
    }

    /**
     * 댓글 삭제
     * DELETE /api/comments/{commentId}
     * deleteComment
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Boolean> deleteComment(@PathVariable int commentId) {
        try {
            log.info("commentId : {}", commentId);
            boolean result = commentService.deleteComment(commentId);
            log.info("result : " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("댓글 삭제 실패 : {}", e.getMessage());
            return  ResponseEntity.badRequest().body(false);
        }
    }
}
