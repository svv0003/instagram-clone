package com.instagram.save.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Save {
    private int saveId;
    private int postId;
    private int userId;
    private String createdAt;
}
