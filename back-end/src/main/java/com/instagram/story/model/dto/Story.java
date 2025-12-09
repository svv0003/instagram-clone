package com.instagram.story.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Story {
    private int storyId;
    private int userId;
    private String storyImage;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    private String userName;
    private String userFullname;
    private String userAvatar;
}
