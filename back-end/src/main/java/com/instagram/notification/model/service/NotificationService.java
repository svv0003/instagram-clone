package com.instagram.notification.model.service;

import com.instagram.notification.model.dto.Notification;

import java.util.List;

public interface NotificationService {
    boolean addNotification(Notification notification);
    List<Notification> getMyNotifications(int userId);
    void updateStatus(int loginUserId, int notificationId);
}
