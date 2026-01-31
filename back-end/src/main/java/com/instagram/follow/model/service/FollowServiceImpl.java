package com.instagram.follow.model.service;

import com.instagram.follow.model.dto.Follow;
import com.instagram.follow.model.mapper.FollowMapper;
import com.instagram.notification.model.dto.Notification;
import com.instagram.notification.model.service.NotificationService;
import com.instagram.user.model.dto.User;
import com.instagram.user.model.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {

    private final FollowMapper followMapper;
    private final UserMapper userMapper;
    private final NotificationService notificationService;

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
     * 팔로잉 유저 목록 조회
     * @param userId
     * @return
     */
    @Override
    public List<User> getFollowingUserList(int userId) {
        try {
            return userMapper.selectFollowingUserByUserIdList(userId);
        } catch (Exception e) {
            log.error(e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * 팔로워 유저 목록 조회
     * @param userId
     * @return
     */
    @Override
    public List<User> getFollowerUserList(int userId) {
        try {
            return userMapper.selectFollowerUserByUserIdList(userId);
        } catch (Exception e) {
            log.error(e.getMessage());
            return Collections.emptyList();
        }
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
            boolean result = followMapper.insertFollowing(follow);
            if(result) {
                Notification notification = new Notification();
                notification.setNotificationSenderId(loginUserId);
                notification.setNotificationReceiverId(userId);
                notification.setNotificationType("FOLLOW");
                notification.setNotification_content_id(follow.getFollowId()); // useGeneratedKeys로 얻은 PK
                notificationService.addNotification(notification);
            }
            return result;
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
