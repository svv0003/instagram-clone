package com.instagram.like.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Like {
    private int like_id;
    private int post_id;
    private int user_id;
    private String created_at;
}
