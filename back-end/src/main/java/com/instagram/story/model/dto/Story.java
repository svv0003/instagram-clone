package com.instagram.story.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Story {
    private int storyId;
    private int userId;
    private String storyImage;
    private String createdAt;
    private String updatedAt;
}
