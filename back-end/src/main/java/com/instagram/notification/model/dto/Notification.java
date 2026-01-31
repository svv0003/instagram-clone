package com.instagram.notification.model.dto;

import lombok.Data;

@Data
public class Notification {
    private int notificationId;
    private int notificationSenderId;
    private int notificationReceiverId;
    private String notificationType; // FOLLOW, BOARD_LIKE, BOARD_COMMENT
    private int notification_content_id; // 각 테이블의 PK
    private boolean isRead;
    private String createdAt;

    // View 조회를 위한 필드 (선택 사항)
    private String senderName;
    private String senderAvatar;
}