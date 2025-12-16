package com.instagram.follow.model.service;

import com.instagram.follow.model.dto.Follow;

import java.util.List;

public interface FollowService {

    /**
     * selectFollowingUserId
     *
     * @param loginUserId
     * @return
     */
    List<Integer> getFollowingUserId(int loginUserId);
    /**
     * 로그인 회원이 팔로우하는 계정 수
     *
     * @param loginUserId
     * @return
     */
    int getFollowingUsers(int loginUserId);
    /**
     * 로그인 회원을 팔로우하는 계정 수
     *
     * @param loginUserId
     * @return
     */
    int getFollowerUsers(int loginUserId);
    /**
     * 팔로우 추가
     *
     * @param userId
     * @param loginUserId
     * @return
     */
    boolean addFollowing(int userId, int loginUserId);
    /**
     * 팔로우 삭제
     *
     * @param userId
     * @param loginUserId
     * @return
     */
    boolean deleteFollowing(int userId, int loginUserId);
}
