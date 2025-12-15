package com.instagram.comment.model.mapper;

import com.instagram.comment.model.dto.Comment;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommentMapper {
    /**
     * 특정 게시물 댓글 목록 조회
     * @param postId
     * @return
     */
    List<Comment> selectCommentsByPostId(int postId);
    /**
     * 댓글 작성
     * @param comment
     * @return
     */
    int insertComment(Comment comment);
    /**
     * 댓글 수정
     * @return
     */
    int updateComment(int commentId, String commentContent);
    /**
     * 댓글 삭제
     * @param commentId
     * @return
     */
    int deleteComment(int commentId);
}
