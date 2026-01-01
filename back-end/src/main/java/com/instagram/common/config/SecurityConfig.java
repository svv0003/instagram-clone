package com.instagram.common.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.server.SecurityWebFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * @Configuration - 환경설정용 클래스임을 명시
 * 스프링부트는 프로젝트 실행할 때 @Configuration 어노테이션을 가장 먼저 확인
 * 객체로 생성해서 내부 코드를  서버 실행시 모두 실행
 * @Bean 개발자가 수동으로 생성한 객체의 관리를
 * 스프링부트에서 자체적으로 관리하라고 넘기는 어노테이션
 */
@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /*
    세션은 쓰는데, 동시에 몇 개까지 허용할지 제한
    서버 세션 생성 ⭕
    로그인 상태 세션에 저장 ⭕
    동일 계정 다중 로그인 제어
     */
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                .csrf(csrf -> csrf.disable())
//
//                .formLogin(AbstractHttpConfigurer::disable)
//
//                // HTTP Basic 인증 비활성화
//                .httpBasic(basic -> basic.disable())
//
//                /**
//                 * 권한 설정 - 모든 요청 허용
//                 * 현재는 개발 단계이기 때문에 특정 api나 url 경로 설정에 대하여
//                 * 접근 제한을 하지 않고 모두 아이디 비밀번호 없이 접근 가능하도록 설정하나,
//                 * 모든 프로젝트를 마무리하고 배포작업을 진행하기 전에는
//                 * 커스텀 URL 접근 설정을 진행해야한다.
//                 */
//                .authorizeHttpRequests(
//                        auth -> auth
//                        .anyRequest().permitAll())
//
//                /**
//                 * 특정 페이지는 아이디 비밀번호 없이 접근 가능하도록 권한 설정
//                 * 정적 리소스는 인증 없이 접근 가능
//                 * 리액트로 진행하는 프론트엔드 또한 빌드작업을 하여
//                 * resource 와 static 으로 정적데이터를 가져오면
//                 * 하위 폴더에 접근할 수 있는 권한이 존재해야하기 때문에 미리 작성
//
//                 .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/profile_images/**",
//                 "/css/**",
//                 "/js/**",
//                 "/images/**"
//                 ).permitAll()
//                 .anyRequest().authenticated()
//
//                 )
//                 */
//
//
//                // 세션 관리 설정 추가
//                .sessionManagement(session -> session
//                        .maximumSessions(1) // 동시 세션 1개만 허용
//                        .maxSessionsPreventsLogin(false) // 새 로그인 시 기존 세 무효화
//                );
//
//
//                /*
//                SecurityConfig는 모든 API 경로에서 최우선 권한을 갖고 있다.
//                MemberAPIController에서 작동해야 하는 로그아웃 경로를
//                Security가 가로챈다.
//                -> MemberAPIController 로그아웃 동작하지 않는다.
//
//               .logout(logout -> logout
//                    .logoutUrl("/api/auth/logout")
//                    .permitAll()
//                );
//                 */
//
//        return http.build();
//    }


    /*
    Spring Security가 세션을 생성도, 사용도 안 하겠다
    서버에 로그인 상태 저장 ❌
    HttpSession 사용 ❌
    SecurityContext를 세션에 저장 ❌
    매 요청마다 JWT 같은 토큰으로 인증
    언제 쓰나?
    ✔ JWT 기반 REST API
    ✔ 모바일 / SPA
    ✔ MSA
    ✔ WebSocket + JWT
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .formLogin(AbstractHttpConfigurer::disable)

                // HTTP Basic 인증 비활성화
                .httpBasic(basic -> basic.disable())

                // 세션 안 씀 → JWT 사용
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 권한 설정: 로그인, 회원가입, WebSocket은 누구나 접근
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/signup",
                                "/api/auth/check",     // 로그인 상태 확인
                                "/ws/**",              // WebSocket 엔드포인트
                                "/info",               // ← 이거 추가! SockJS가 쓰는 경로
                                "/info/**"             // 안전하게 /**도 추가
                        ).permitAll()
                        // 개발 중일 때만 아래 줄 사용 (나중에 배포 시 삭제 또는 authenticated()로 변경)
                        .anyRequest().permitAll()
                        // .anyRequest().authenticated()
                )

                // 핵심: JWT 필터 등록
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:3001"
                // 배포 도메인도 추가
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
