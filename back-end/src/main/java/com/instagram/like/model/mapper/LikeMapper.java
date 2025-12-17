package com.instagram.like.model.mapper;

import com.instagram.like.model.dto.Like;
import com.instagram.post.model.dto.Post;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LikeMapper {
    List<Integer> selectLikePostId(int loginUserId);
    int selectLikes(int postId);
    boolean insertLike(Like like);
    boolean deleteLike(Like like);
}
