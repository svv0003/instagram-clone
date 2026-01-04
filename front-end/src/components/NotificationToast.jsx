import React from 'react';
import {useToast} from '../context/ToastProvider';
import {useNavigate} from "react-router-dom";

const NotificationToast = () => {
    const { notifications, removeNotification } = useToast();
    const navigate = useNavigate();

    /**
     * 해당 게시물 이동 후 알림 읽음 처리
     * @param notification
     */
    // const handleNotificationClick = (notification) => {
    //     if (notification.boardId) {
    //         navigate(`/board/${notification.boardId}`);
    //         removeNotification(notification.boardId);
    //     }
    // }
    // const handleNotificationClick = (notification) => {
    //     if (notification.boardId) {
    //         navigate(`/board/${notification.boardId}`);
    //     }
    // }
    // const handleNotificationRemove = (notification) => {
    //     if (notification.boardId) {
    //         removeNotification(notification.boardId);
    //     }
    // }

    const getNotificationMessage = (notification) => {
            switch (notification.type) {
                case 'FOLLOW':
                    return `${notification.sendUserName}님이 회원님을 팔로우했습니다`;
                case 'BOARD_LIKE':
                    return `${notification.sendUserName}님이 게시글을 좋아합니다`;
                case 'BOARD_COMMENT':
                    return `${notification.sendUserName}님이 댓글을 남겼습니다`;
                default:
                    return '새 알림이 도착했습니다';
            }
        };

    const handleNotificationClick = (notification) => {
        switch (notification.type) {
            case 'FOLLOW':
                navigate(`/myfeed?userId=${notification.sendUserId}`);
                break;
            case 'BOARD_LIKE':
            case 'BOARD_COMMENT':
                navigate(`/post/${notification.postId}`);
                break;
            default:
                return;
        }
        removeNotification(notification.id);
    };

    const hasDetailPage = (type) =>
        ['FOLLOW', 'BOARD_LIKE', 'BOARD_COMMENT'].includes(type);

    return (
        <>
        <div className="notification-container">
            {notifications.map((notification) => (
                <div key={notification.id} className="notification-toast">
                    <div className="notification-content">
                        <div className="notification-icon">🔔</div>
                        <div className="notification-text">
                            <h4>{getNotificationMessage(notification)}</h4>
                            {hasDetailPage(notification.type) && (
                                <button
                                    className="notification-goto-btn"
                                    onClick={() => handleNotificationClick(notification)}>
                                    상세보기
                                </button>
                            )}
                        </div>

                        <button
                            className="notification-close"
                            onClick={() => removeNotification(notification.id)}
                            aria-label="close"
                        >
                            x
                        </button>
                    </div>
                </div>
            ))}
        </div>
        </>
    );
};

export default NotificationToast;
