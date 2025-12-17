package com.instagram.follow.model.mapper;

import com.instagram.follow.model.dto.Follow;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface FollowMapper {

    /**
     * 로그인 회원이 팔로우하는 계정 리스트
     * @param loginUserId
     * @return
     */
    List<Integer> selectFollowingUserId(int loginUserId);
    /**
     * 로그인 회원이 팔로우하는 계정 수
     * @param loginUserId
     * @return
     */
    int selectFollowingUsers(int loginUserId);
    /**
     * 로그인 회원을 팔로우하는 계정 수
     * @param loginUserId
     * @return
     */
    int selectFollowerUsers(int loginUserId);
    /**
     * 팔로우 추가
     * @param follow
     */
    boolean insertFollowing(Follow follow);
    /**
     * 팔로우 삭제
     *
     * @param follow
     * @return
     */
    boolean deleteFollowing(Follow follow);
}
