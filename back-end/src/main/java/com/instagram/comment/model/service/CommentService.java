package com.instagram.comment.model.service;

import com.instagram.comment.model.dto.Comment;
import com.instagram.comment.model.dto.CommentResponse;

import java.util.List;

public interface CommentService {

    /*
    댓글이 없는 경우를 고려하지 않은 경우
    List<Comment> getCommentsByPostId(int postId);
     */
    CommentResponse getCommentsByPostId(int postId);
    boolean createComment(int postId, int userId, String commentContent);
    boolean updateComment(int commentId, String commentContent);
    boolean deleteComment(int commentId);
}
