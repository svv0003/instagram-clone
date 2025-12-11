package com.instagram.user.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.user.model.dto.LoginRequest;
import com.instagram.user.model.dto.LoginResponse;
import com.instagram.user.model.dto.User;
import com.instagram.user.model.service.KakaoServiceImpl;
import com.instagram.user.model.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final KakaoServiceImpl kakaoService;
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
        String token = jwtUtil.generateToken(user.getUserId(), user.getUserEmail());
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setUser(user);
        log.info("로그인 성공 - 이메일: {}", user.getUserEmail());
        return ResponseEntity.ok(loginResponse);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getPostsByUserId(@PathVariable("userId") int userId) {
        User user = userService.getUserByUserId(userId);
        return ResponseEntity.ok(user);
    }

//    @GetMapping("/profile/edit")
//    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String authHeader) {
//        try {
//            String token = authHeader.substring(7);
//            int userId = jwtUtil.getUserIdFromToken(token);
//            User u = userService.getUserByUserId(userId);
//            if(u != null) {
//                u.setUserPassword(null);
//            }
//            return ResponseEntity.ok(u);
//        } catch (Exception e) {
//            log.error("프로필 조회 실패 : {}", e.getMessage());
//            return ResponseEntity.status(401).body(null);
//        }
//    }

    @PutMapping("/profile/edit/{userId}")
    public ResponseEntity<User> editProfile(@PathVariable("userId") int userId,
                                            @RequestPart("formData") User user,
                                            @RequestPart(value = "profileImage", required = false) MultipartFile userAvatar){
        try {
            log.info("user : {}", user);
            user.setUserId(userId);
            log.info("user : {}", user);
            log.info("profileImage : {}", userAvatar);
            User u = userService.updateUser(user, userAvatar);
            return ResponseEntity.ok(u);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> data) {
        String code = data.get("code");
        log.info("카카오 로그인 요청 - code: {}", code);

        if (code == null || code.isEmpty()) {
            log.error("카카오 code가 null이거나 비어있습니다.");
            return ResponseEntity.status(400).body("인증 코드가 없습니다.");
        }

        String accessToken = kakaoService.getAccessToken(code);
        if (accessToken == null) {
            log.error("카카오 액세스 토큰 발급 실패");
            return ResponseEntity.status(400).body("카카오 토큰 발급 실패");
        }
        log.info("카카오 액세스 토큰 발급 성공");

        User kakaoUser = kakaoService.getKakaoUserInfo(accessToken);
        if (kakaoUser == null) {
            log.error("카카오 사용자 정보 조회 실패");
            return ResponseEntity.status(400).body("카카오 유저 정보 조회 실패");
        }
        log.info("카카오 사용자 정보 조회 성공 - email: {}", kakaoUser.getUserEmail());

        User existUser = userService.getUserByUserEmail(kakaoUser.getUserEmail());

        if (existUser != null) {
            String token = jwtUtil.generateToken(existUser.getUserId(), existUser.getUserEmail());

            LoginResponse loginResponse = new LoginResponse();
            loginResponse.setToken(token);
            loginResponse.setUser(existUser);

            log.info("카카오 로그인 성공: {}", existUser.getUserEmail());
            return ResponseEntity.ok(loginResponse); // 200 OK
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "need_signup");
            response.put("kakaoUser", kakaoUser);

            log.info("카카오 로그인 - 미가입 회원: {}", kakaoUser.getUserEmail());
            return ResponseEntity.status(202).body(response);
        }
    }

}
