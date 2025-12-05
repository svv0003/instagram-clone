package com.instagram.user.controller;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

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
    public void login(@RequestBody User user){
        log.info("===로그인 요청===");
        log.info("요청 데이터 - 이름 : {}, 이메일 : {}", user.getUserName(), user.getUserPassword());
        try {
            userService.login(user.getUserName(), user.getUserPassword());
            log.info("회원가입 성공 - 이메일 : {}", user.getUserName());
        } catch (Exception e){
            log.error("회원가입 실패 - 이메일 : {}, 에러 : {}", user.getUserEmail(), e.getMessage());
        }
    }
}
