package com.instagram.user.model.mapper;

import com.instagram.user.model.dto.User;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserMapper {

    // 사용자 생성
    void insertUser(User user);
    // 사용자 수정
    void updateUser(User user);
    // 사용자 삭제
    void deleteUser(int userId);
    // id로 사용자 조회
    User selectUserById(int userId);
    // 이름으로 사용자 조회
    String selectUserByUserName(String userName);
    // email로 사용자 조회
    String selectUserByUserEmail(String email);
    // 비밀번호 확인
    User selectUserByUserPassword(String userPassword);
    // 모든 사용자 조회
    List<User> selectAllUsers();
}
