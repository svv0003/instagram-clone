package com.instagram.user.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.user.model.dto.LoginRequest;
import com.instagram.user.model.dto.LoginResponse;
import com.instagram.user.model.dto.User;
import com.instagram.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/signup")
    public void saveSignup(@RequestBody User user){
        log.info("===회원가입 요청===");
        log.info("요청 데이터 - 이름 : {}, 이메일 : {}", user.getUserName(), user.getUserEmail());
        try {
            userService.signUp(user);
            log.info("회원가입 성공 - 이메일 : {}", user.getUserEmail());
        } catch (Exception e){
            log.error("회원가입 실패 - 이메일 : {}, 에러 : {}", user.getUserEmail(), e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
        /*
        TODO
        로그인 성공 시 JWT 토큰 생성
         */
        User user = userService.login(request.getUserEmail(), request.getUserPassword());
        log.info("===로그인 요청===");
        log.info("요청 데이터 - 이름 : {}, 이메일 : {}", user.getUserName(), user.getUserEmail());
        if(user == null) {
            return ResponseEntity.status(401).body(null);
        }
        String token = jwtUtil.generageToken(user.getUserId(), user.getUserEmail());
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setUser(user);
        log.info("로그인 성공 - 이메일: {}", user.getUserEmail());
        return ResponseEntity.ok(loginResponse);
    }
}
