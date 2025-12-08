package com.instagram.post.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    private int postId;
    private int userId;
    private String postImage;
    private String postCaption;
    private String postLocation;
    private String createdAt;
    private String updatedAt;

    // 뷰(Post_Details_View)에서 추가된 컬럼
    private String userName;
    private String userFullname;
    private String userAvatar;

    // 집계 컬럼
    private String likeCount;
    private String commentCount;
}
