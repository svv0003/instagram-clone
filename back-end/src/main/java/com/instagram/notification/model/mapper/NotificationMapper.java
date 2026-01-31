package com.instagram.notification.model.mapper;

import com.instagram.notification.model.dto.Notification;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface NotificationMapper {
    int insertNotification(Notification notification);
    List<Notification> selectMyNotifications(int userId);
    void updateReadStatus(Notification notification);
}
