package com.instagram.common.config;

import com.instagram.common.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Collections;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocket implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        /*
        공용 (broadcast)      /topic/notifications            현재 연결된 모든 클라이언트     "전체 공지, 실시간 피드 등"
        개인 (user-specific)  /user/123/queue/notifications   userId가 123인 클라이언트만     "팔로우 알림, DM, 좋아요 알림 등"

        messagingTemplate.convertAndSend        (        "/topic/notifications", notification );
        messagingTemplate.convertAndSendToUser  ( "123", "/queue/notifications", notification );
         */

        /*
        /topic으로 시작하는 경로는 공용 브로드캐스트용,
        /queue으로 시작하는 경로는 개인 메시지용 브로커를 활성화하라는 코드
         */
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");

        /*
        개인에게 보내는 메시지의 목적지 경로 앞에 자동으로 붙일 prefix를 /user로 /user/{userId} 라우팅 설정하라는 코드
        messagingTemplate.convertAndSendToUser  ( "123", "/queue/notifications", notification );
        /user/{userId}/queue/notifications 최종 목적지로 변환해서 브로커에게 전달한다.
        이 자동 변환 기능이 작동하려면 setUserDestinationPrefix("/user")를 설정해야 한다.

        user 교체해도 되나?
        기본값이 "/user" 라서 대부분의 문서, 라이브러리가 이 값을 전제로 동작한다.
        바꾸게 되면 최종 경로는 /private/123/queue/notifications 가 되지만
        클라이언트 측 @stomp/stompjs 라이브러리는 내부적으로 항상 /user를 기대하는 로직이 있어서,
        다른 값으로 바꾸면 추가 설정이 필요하거나 동작이 불안정해질 수 있다.
         */
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/ws")

                .setAllowedOriginPatterns("*")

                .withSockJS();
    }

    // ★ STOMP 연결 시 헤더에서 토큰을 꺼내 인증 객체 설정
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // CONNECT 프레임일 때만 토큰 검증
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // 헤더에서 토큰 추출 (Client에서 'Authorization' : 'Bearer {token}'으로 보냈다고 가정)
                    String authHeader = accessor.getFirstNativeHeader("Authorization");

                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);

                        // 토큰 유효성 검사 및 Authentication 객체 생성
//                        if (jwtUtil.validateToken(token)) {
//                            int userId =
//                                    jwtUtil.getUserIdFromToken(token);
//
//                            Authentication auth =
//                                    new UsernamePasswordAuthenticationToken(
//                                            String.valueOf(userId),
//                                            null,
//                                            Collections.emptyList()
//                                    );
                            if (jwtTokenProvider.validateToken(token)) {
                            Authentication auth = jwtTokenProvider.getAuthentication(token);

                            // ★ WebSocket 세션에 사용자 정보(Principal) 등록
                            accessor.setUser(auth);
                        }
                    }
                }
                return message;
            }
        });
    }
}

/*
기존 내 코드

@Configuration
@EnableWebSocketMessageBroker
public class WebSocket implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/user");
}

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
 */

/*

// 경란쌤 피드백
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/queue", "/topic");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    // ★ STOMP 연결 시 헤더에서 토큰을 꺼내 인증 객체 설정
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                // CONNECT 프레임일 때만 토큰 검증
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    // 헤더에서 토큰 추출 (Client에서 'Authorization' : 'Bearer {token}'으로 보냈다고 가정)
                    String authHeader = accessor.getFirstNativeHeader("Authorization");

                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);

                        // 토큰 유효성 검사 및 Authentication 객체 생성
                        if (jwtTokenProvider.validateToken(token)) {
                            Authentication auth = jwtTokenProvider.getAuthentication(token);

                            // ★ WebSocket 세션에 사용자 정보(Principal) 등록
                            accessor.setUser(auth);
                        }
                    }
                }
                return message;
            }
        });
    }
}
 */