package com.instagram.common.config;

import com.instagram.common.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/*
Spring WebSocket(STOMP)의 개인 알림은 Spring Security의 Authentication 객체 안에 들어 있는 principal 값을 기준으로 구분한다.
백엔드에서 convertAndSendToUser(String.valueOf(userId), ...) 할 때 넣는 문자열과 정확히 일치해야 한다.

Spring Security는 현재 로그인한 사용자를 어떻게 기억하나?
모든 HTTP 요청(일반 API + WebSocket handshake 포함)이 들어올 때
JwtAuthenticationFilter가 실행되어 JWT 토큰을 검증한다.

WebSocket 연결 시 이 정보가 어떻게 전달되나?
WebSocket은 처음 연결할 때 HTTP handshake 요청을 보낸다.
이 요청도 일반 HTTP 요청처럼 Authorization: Bearer 헤더를 포함하고 있다.
그래서 JwtAuthenticationFilter가 실행되고, SecurityContext에 userId를 principal로 저장한다.
WebSocket 세션이 만들어질 때 Spring은 이 Authentication 정보를 WebSocket 세션에 자동으로 연결한다.

개인 알림 보낼 때 이 정보가 어떻게 쓰이나?
백엔드에서 팔로우 알림 보낼 때 Spring은 내부적으로 사용자의 principal이 userId인 WebSocket 세션에게만 보낸다.
그리고 클라이언트 측에서 /queue/notifications를 구독하면,
STOMP 라이브러리가 본인의 principal(=Authentication.getPrincipal())에 맞는 /user/{userId}/queue/notifications를 구독해 자동으로 처리해 준다.
 */

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // WebSocket handshake도 여기서 처리된다.
        /*
        왜 handshake가 필요하나?
        일반 HTTP는 클라이언트가 요청하면 서버가 응답하고 연결이 끊어지는 단방향, 요청-응답 방식이다.
        반면 WebSocket은 연결을 한 번 맺은 후 양쪽이 자유롭게 메시지를 주고받을 수 있는 지속적인 양방향 연결이다.
        하지만 브라우저와 서버는 처음에 HTTP로만 통신을 시작할 수 있기 때문에
        WebSocket을 쓰려면 먼저 일반 HTTP 요청을 보내서 WebSocket 사용하도록 물어보고,
        서버가 승인해야 진짜 WebSocket 연결이 성립되며, 이 과정이 handshake이다.
         */
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                int userId = jwtUtil.getUserIdFromToken(token);

                /*
                현재 요청을 한 사용자의 principal을 userId 문자열로 설정한다.
                 */
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                String.valueOf(userId),
                                null,
                                Collections.emptyList()
                        );
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                /*
                이 SecurityContext는 스레드 로컬에 저장되어,
                같은 요청 안에서 어디서든 SecurityContextHolder.getContext().getAuthentication()로 꺼낼 수 있다.
                 */
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}