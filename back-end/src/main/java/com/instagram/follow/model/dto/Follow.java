package com.instagram.follow.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Follow {
    private int followId;
    private int followerId;
    private int followingId;
    private String createdAt;
}
