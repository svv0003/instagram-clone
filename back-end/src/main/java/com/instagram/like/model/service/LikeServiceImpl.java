package com.instagram.like.model.service;

import com.instagram.follow.model.dto.Follow;
import com.instagram.like.model.dto.Like;
import com.instagram.like.model.mapper.LikeMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeMapper likeMapper;

    @Override
    public List<Integer> getLikePostId(int loginUserId) {
        return likeMapper.selectLikePostId(loginUserId);
    }

    /**
     * 팔로우 유무 확인
     * @param postId
     * @param loginUserId
     * @return
     */
    @Override
    public boolean checkLike(int postId, int loginUserId) {
        Like like = new Like();
        like.setPostId(postId);
        like.setUserId(loginUserId);
        return likeMapper.selectLike(like);
    }

    @Override
    public int getLikes(int postId) {
        return likeMapper.selectLikes(postId);
    }

    @Override
    public boolean addLike(int postId, int loginUserId) {
        try {
            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(loginUserId);
            return likeMapper.insertLike(like);
        } catch (Exception e) {
            log.error("좋아요 반영 문제 발생 : {}", e);
            return false;
        }
    }

    @Override
    public boolean deleteLike(int postId, int loginUserId) {
        try {
            Like like = new Like();
            like.setPostId(postId);
            like.setUserId(loginUserId);
            return likeMapper.deleteLike(like);
        } catch (Exception e) {
            log.error("좋아요 취소 문제 발생 : {}", e);
            return false;
        }
    }
}
