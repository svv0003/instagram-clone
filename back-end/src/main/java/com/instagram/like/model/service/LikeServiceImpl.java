package com.instagram.like.model.service;

import com.instagram.follow.model.dto.Follow;
import com.instagram.like.model.dto.Like;
import com.instagram.like.model.mapper.LikeMapper;
import com.instagram.notification.model.dto.Notification;
import com.instagram.notification.model.service.NotificationService;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeMapper likeMapper;
    private final PostMapper postMapper;
    private final NotificationService notificationService;


    @Override
    public List<Integer> getLikePostId(int loginUserId) {
        return likeMapper.selectLikePostId(loginUserId);
    }

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
            boolean result = likeMapper.insertLike(like);
            if(result) {
                Post post = postMapper.selectPostById(postId);
                if(loginUserId != post.getUserId()) {           // 본인 글 좋아요 제외
                    Notification notification = new Notification();
                    notification.setNotificationSenderId(loginUserId);
                    notification.setNotificationReceiverId(post.getUserId());
                    notification.setNotificationType("LIKE");
                    notification.setNotification_content_id(postId);   // 클릭 시 게시물로 이동하므로 postId
                    notificationService.addNotification(notification);
                }
            }
            return result;
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

    @Override
    public List<Integer> getLikesByUserId(int userId) {
        List<Integer> res = likeMapper.selectLikesByUserId(userId);
        return res;
    }
}