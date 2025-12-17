package com.instagram.follow.model.service;

import com.instagram.follow.model.dto.Follow;
import com.instagram.follow.model.mapper.FollowMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowMapper followMapper;

    /**
     * 팔로잉 목록 조회
     * @param loginUserId
     * @return
     */
    @Override
    public List<Integer> getFollowingUserId(int loginUserId) {
        return followMapper.selectFollowingUserId(loginUserId);
    }

    /**
     * 팔로우 유무 확인
     * @param userId
     * @param loginUserId
     * @return
     */
    @Override
    public boolean checkFollowing(int userId, int loginUserId) {
        Follow follow = new Follow();
        follow.setFollowingId(userId);
        follow.setFollowerId(loginUserId);
        return followMapper.selectFollowing(follow);
    }

    /**
     * 팔로잉 수 조회
     * @param feedUserId
     * @return
     */
    @Override
    public int getFollowingUsers(int feedUserId) {
        return followMapper.selectFollowingUsers(feedUserId);
    }

    /**
     * 팔로워 수 조회
     * @param feedUserId
     * @return
     */
    @Override
    public int getFollowerUsers(int feedUserId) {
        return followMapper.selectFollowerUsers(feedUserId);
    }

    @Override
    public boolean addFollowing(int userId, int loginUserId) {
        if(loginUserId == userId) return false;
        try {
            Follow follow = new Follow();
            follow.setFollowingId(userId);
            follow.setFollowerId(loginUserId);
            return followMapper.insertFollowing(follow);
        } catch (Exception e) {
            log.error("팔로우 반영 문제 발생 : {}", e);
            return false;
        }
    }

    @Override
    public boolean deleteFollowing(int userId, int loginUserId) {
        if(loginUserId == userId) return false;
        try {
            Follow follow = new Follow();
            follow.setFollowingId(userId);
            follow.setFollowerId(loginUserId);
            return followMapper.deleteFollowing(follow);
        } catch (Exception e) {
            log.error("팔로우 취소 문제 발생 : {}", e);
            return false;
        }
    }
}
