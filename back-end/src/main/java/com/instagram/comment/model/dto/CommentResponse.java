package com.instagram.comment.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {

    /**
     * 댓글 목록
     */
    private List<Comment> comments;
    /**
     * 댓글 개수
     */
    private int commentCount;
    /**
     * 댓글 없는 경우를 대비하는 생성자
     * 댓글이 있으면 comments.size()
     * 댓글이 없으면 0
     */
    public CommentResponse(List<Comment> comments) {
        this.comments = comments;
        this.commentCount = comments != null ? comments.size() : 0;
    }
}
