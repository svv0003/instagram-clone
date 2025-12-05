package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;
import com.instagram.user.model.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void signUp(User user) {
        /*
        TODO
        이미 존재하는 이메일인지 아닌지 확인하기
        이미 존재하는 사용자명인지 아닌지 확인하기
        이미 존재한다면 throw new RunTimeException "이미 존재하는 이메일입니다." 처리하기
        존재하지 않는 이메일이라면 비밀번호 암호화 처리하기
         */
        User existingEmail = userMapper.selectUserByUserEmail(user.getUserEmail());
        if(existingEmail != null) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }
        String existingName = userMapper.selectUserByUserName(user.getUserName());
        if(existingName != null) {
            throw new RuntimeException("이미 존재하는 사용자명입니다.");
        }
        if(user.getUserAvatar() == null || user.getUserAvatar().isEmpty()) {
            user.setUserAvatar("default-avatar.png");
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

    @Override
    public User getUserByUserEmail(String userEmail) {
        return null;
    }

    @Override
    public User getUserByUserName(String userName) {
        return null;
    }
}
