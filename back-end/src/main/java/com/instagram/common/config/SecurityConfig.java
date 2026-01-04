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

/*
스프링 시큐리티는 애플리케이션의 보안(인증, 인가, CSRF 보호 등)을 담당한다.
프로젝트를 단순히 빠르게 테스트하기 위한 세션 기반 인증 방식
-> 실제 서비스처럼 JWT 기반 인증을 제대로 적용한 설정으로 수정
 */

/**
 * @Configuration - 환경설정용 클래스임을 명시
 * 스프링부트는 프로젝트 실행할 때 @Configuration 어노테이션을 가장 먼저 확인
 * 객체로 생성해서 내부 코드를  서버 실행시 모두 실행
 * @Bean 개발자가 수동으로 생성한 객체의 관리를
 * 스프링부트에서 자체적으로 관리하라고 넘기는 어노테이션
 */
@Configuration
public class SecurityConfig {

    /*
    비밀번호를 안전하게 저장하기 위해 BCrypt 해시 알고리즘을 사용하는 인코더를 스프링 빈으로 등록한다.
    회원가입 시 입력한 비밀번호를 이걸로 암호화해서 DB에 저장하고, 로그인할 때도 같은 방식으로 비교한다.
     */
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /*
    스프링 시큐리티의 전체 보안 필터 체인을 정의한다.
    JwtAuthenticationFilter를 파라미터로 주입받아서 나중에 등록한다.
     */
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http
//                /*
//                개발 초기라 편의를 위해 CSRF 보호를 끈다.
//                 */
//                .csrf(csrf -> csrf.disable())
//
//                 /*
//                 스프링이 기본으로 제공하는 로그인 폼을 사용하지 않겠다.
//                  */
//                .formLogin(AbstractHttpConfigurer::disable)
//
//                /*
//                HTTP Basic 인증(헤더에 ID/PW 넣는 방식) 비활성화한다.
//                */
//                .httpBasic(basic -> basic.disable())
//
//                /*
//                권한 설정 - 모든 요청 허용
//                현재는 개발 단계이기 때문에 편의를 위해 특정 api나 url 경로 설정에 대한 접근 제한을 하지 않고,
//                모두 아이디 비밀번호 없이 접근 가능하도록 설정하지만 작업을 마무리하고 배포를 진행하기 전에는
//                커스텀 URL 접근 설정을 진행해야 한다.
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
//                      .requestMatchers("/profile_images/**",
//                          "/css/**",
//                          "/js/**",
//                          "/images/**")
//                      .permitAll()
//                      .anyRequest()
//                      .authenticated()
//                 )
//                 */
//
//                /*
//                한 사용자가 동시에 하나의 브라우저/디바이스에서만 로그인 가능하게 제한하고,
//                새로 로그인하면 기존 세션을 끊어버리며, 세션을 사용하기 때문에 가능한 세션 관리 설정이다.
//                 */
//                .sessionManagement(session -> session
//                        .maximumSessions(1)               // 동시 세션 1개만 허용
//                        .maxSessionsPreventsLogin(false)  // 새 로그인 시 기존 세 무효화
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


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .formLogin(AbstractHttpConfigurer::disable)

                .httpBasic(basic -> basic.disable())

                /*
                세션을 아예 생성하지 않겠다.
                서버는 로그인 상태를 기억하지 않고, 모든 인증을 클라이언트가 보내는 JWT 토큰으로만 판단한다.
                 */
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 권한 설정: 로그인, 회원가입, WebSocket은 누구나 접근
                /*
                다음 경로들은 로그인(인증) 없이도 접근 가능하게 열어둔다.
                 */
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/login",     // 로그인
                                "/api/auth/signup",    // 회원가입
                                "/api/auth/check",     // 로그인 상태 확인
                                "/ws/**",              // WebSocket 엔드포인트
                                "/info",               // SockJS 경로
                                "/info/**"
                        ).permitAll()
                        /*
                        나머지 모든 API는 현재 개발 중이라 인증 없이 허용한다.
                        배포 전에 .anyRequest().authenticated()로 바꾸면 JWT 없으면 접근 불가능하다.
                         */
                        .anyRequest().permitAll()
                )

                // 핵심: JWT 필터 등록
                /*
                직접 만든 JwtAuthenticationFilter를 등록한다.
                모든 요청이 들어올 때마다 이 필터가 먼저 실행되어 Authorization 헤더의 Bearer 토큰을 검사하고,
                유효하면 SecurityContext에 사용자 정보(userId)를 넣어준다.
                 */
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        /*
        React 프론트엔드가 다른 포트에서 백엔드 호출할 수 있게 CORS 허용 설정을 적용한다.
         */
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
