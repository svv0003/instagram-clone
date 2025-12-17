package com.instagram.like.model.service;

import com.instagram.like.model.dto.Like;

import java.util.List;

public interface LikeService {
    List<Integer> getLikePostId(int loginUserId);
    int getLikes(int postId);
    boolean addLike(int postId, int loginUserId);
    boolean deleteLike(int postId, int loginUserId);
}
