package com.instagram.like.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Like {
    private int likeId;
    private int postId;
    private int userId;
    private String createdAt;
}
