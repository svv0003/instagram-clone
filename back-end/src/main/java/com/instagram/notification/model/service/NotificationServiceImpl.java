package com.instagram.notification.model.service;

import com.instagram.notification.model.dto.Notification;
import com.instagram.notification.model.mapper.NotificationMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationMapper notificationMapper;

    public boolean addNotification(Notification notification){
        int result = notificationMapper.insertNotification(notification);
        return result > 0;
    };

    public List<Notification> getMyNotifications(int userId){
        List<Notification> result = notificationMapper.selectMyNotifications(userId);
        return result;
    };

    public void updateStatus(int loginUserId, int notificationId){
        Notification notification = new Notification();
        notification.setNotificationReceiverId(loginUserId);
        notification.setNotificationId(notificationId);
        notificationMapper.updateReadStatus(notification);
    };
}
