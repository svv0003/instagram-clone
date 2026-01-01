import {createContext, useContext, useEffect, useState} from "react";
import  SockJS from 'sockjs-client';
import {Client} from "@stomp/stompjs";
import {API_URL} from "../service/apiService";

const ToastContext = createContext();

export const useToast = () => {
    return useContext(ToastContext);
}

const ToastProvider = ({children}) => {
    const [notifications, setNotifications] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    // 알림 삭제 함수
    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    // 알림 읽음 처리
    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? {...n, read : true} : n));
    }

    // 모든 알림 삭제
    const clearAll = () => {
        setNotifications([]);
    }

    useEffect(() => {
        // 웹 소켓 연결 설정
        const socket = new SockJS('http://localhost:9000/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay:5000,
        });
        client.onConnect = () => {
            console.log("웹소켓 연결 성공");
            client.subscribe('/topic/notifications', (msg) => {
                const n = JSON.parse(msg.body);
                console.log("받은 알림 : ", n);
                const newNotification = {
                    id:Date.now(),
                    ...n,
                    read:false
                }
                setNotifications(p => [...p, newNotification] );
                // 5초 후 자동 삭제
                // setTimeout(() => {
                //     removeNotification(newNotification.id);
                // },5000);
            });
            client.subscribe('/user/queue/notifications', (msg) => {
                const n = JSON.parse(msg.body);
                console.log("🔔 개인 알림:", n);

                setNotifications(prev => [
                    ...prev,
                    { ...n, id: Date.now(), read: false }
                ]);
            });
        };


        client.onStompError = () => {
            alert("연결 실패");
        };

        client.activate();

        // 연결 해제
        return () => {
            client.deactivate();
        }
    }, []);

    const value = {
        notifications,
        removeNotification,
        markAsRead,
        clearAll
    }

    return(
        <ToastContext.Provider value={value}>
            {children}
        </ToastContext.Provider>
    )
}

export  default  ToastProvider;
