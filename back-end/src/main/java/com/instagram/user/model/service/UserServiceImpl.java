package com.instagram.user.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.user.model.dto.User;
import com.instagram.user.model.mapper.UserMapper;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private final FileUploadService fileUploadService;

    @Override
    public void signUp(User user) {
        User existingEmail = userMapper.selectUserByUserEmail(user.getUserEmail());
        if(existingEmail != null) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        String existingName = userMapper.selectUserByUserName(user.getUserName());
        if(existingName != null) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if(user.getUserAvatar() == null || user.getUserAvatar().isEmpty()) {
            user.setUserAvatar("/static/img/default-avatar.jpg");
        }
        String originPW = user.getUserPassword();
        String encodedPW = passwordEncoder.encode(originPW);
        user.setUserPassword(encodedPW);
        userMapper.insertUser(user);
        log.info("회원가입 완료 - 이메일: {}, 사용자명: {}", user.getUserEmail(), user.getUserName());
    }

    @Override
    public User login(String userEmail, String userPassword) {
        User checkUserFromDB = userMapper.selectUserByUserEmail(userEmail);
        if(checkUserFromDB == null) {
            log.warn("로그인 실패 - 존재하지 않는 이메일 : {}", userEmail);
            return null;
        }
        if(!passwordEncoder.matches(userPassword, checkUserFromDB.getUserPassword())) {
            log.warn("로그인 실패 - 잘못된 비밀번호 : {}",userEmail);
            return null;
        }
        checkUserFromDB.setUserPassword(null);
        log.info("로그인성공 - 이메일 {}",userEmail);
        return checkUserFromDB;
    }

    /**
     * 로그인 상태확인
     * @param session 현재 세션을 가져온 후
     * @return 로그인 이 되어있으면 로그인이 되어있는 상태로 반환
     */
    public Map<String, Object> checkLoginStatus(HttpSession session) {
        Map<String, Object> res = new HashMap<>();
        User loginUser = (User) session.getAttribute("loginUser");

        if(loginUser == null) {
            res.put("loggedIn", false);
            res.put("user", null);
            log.debug("로그인 상태 확인: 로그인되지 않음");
        }else {
            res.put("loggedIn", true);
            res.put("user",loginUser);
            log.debug("로그인 상태 확인 : {}", loginUser.getUserEmail());
        }
        return  res;
    }

    @Override
    public User getUserByUserEmail(String userEmail) {
        return null;
    }

    @Override
    public User getUserByUserId(int userId) {
        return userMapper.selectUserById(userId);
    }

    @Override
    @Transactional
    public User updateUser(User user, MultipartFile file) {
        log.info("updateUser 시작, user.getUserId: {}",  user.getUserId());
        User getUserDataFromDB = userMapper.selectUserById(user.getUserId());
        log.info("getUserDataFromDB : {}", getUserDataFromDB);
        if(getUserDataFromDB == null) {
            throw new RuntimeException("사용자 정보를 찾을 수 없습니다.");
        }
        log.info("getUserDataFromDB : {}", getUserDataFromDB);
        if(user == null) return null;
        log.info("user : {}", user);
        if(file != null && !file.isEmpty()) {
            try {
                log.info("file : {}", file);
                String imageUrl =
                        fileUploadService.uploadProfileImage(
                                file, user.getUserId(), "profile");
                log.info("imageUrl : {}", imageUrl);
                getUserDataFromDB.setUserAvatar(imageUrl);
            } catch (Exception e) {
                log.error("프로필 수정 문제 발생 : {}", e);
                return null;
            }
        }
        if(user.getUserName() != null) getUserDataFromDB.setUserName(user.getUserName());
        if(user.getUserEmail() != null) getUserDataFromDB.setUserEmail(user.getUserEmail());
        if(user.getUserPassword() != null) getUserDataFromDB.setUserPassword(passwordEncoder.encode(user.getUserPassword()));
        if(user.getUserFullname() != null) getUserDataFromDB.setUserFullname(user.getUserFullname());
        log.info("getUserDataFromDB(2) : {}", getUserDataFromDB);
        int result = userMapper.updateUser(getUserDataFromDB);
        log.info("result : {}", result);
        User abc = userMapper.selectUserById(user.getUserId());
        log.info("user(2) : {}", abc);
        getUserDataFromDB.setUserPassword(null);
        return getUserDataFromDB;
    }

    // TODO 7: searchUsers 메서드 구현
    @Override
    public List<User> searchUsers(String query) {
        if(query == null || query.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return userMapper.searchUsersByUserName(query);
        } catch (Exception e) {
            log.error("유저 이름 조회 중 오류 발생 : {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    public boolean checkPassword(int userId, String password) {
        User checkUserFromDB = userMapper.selectUserById(userId);
        if(checkUserFromDB == null) {
            log.warn("로그인 실패 - 존재하지 않는 계정 : {}", userId);
            return false;
        }
        if(!passwordEncoder.matches(password, checkUserFromDB.getUserPassword())) {
            log.warn("비밀번호 불일치");
            return false;
        }
        log.info("비밀번호 일치");
        return true;
    }

    @Override
    public boolean changePassword(int userId, String newPassword) {
        try {
            User user = new User();
            String newEncodedPW = passwordEncoder.encode(newPassword);
            user.setUserId(userId);
            user.setUserPassword(newEncodedPW);
            log.info("userId : {}, newPassword : {}", userId, newPassword);
            log.info("user : {}", user);
            userMapper.updateUserPassword(user);
            return true;
        } catch (Exception e) {
            log.error("비밀번호 수정 실패 : {}", e.getMessage());
            return false;
        }
    }

    @Override
    public User getUserByUserName(String userName) {
        try {
            return userMapper.selectUserByUserNameExact(userName);
        } catch (Exception e) {
            log.error("유저네임으로 유저 조회 중 오류 발생 : {}", e.getMessage());
            return null;
        }
    }

}
