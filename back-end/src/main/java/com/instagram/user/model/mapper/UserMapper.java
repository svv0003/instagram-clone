package com.instagram.user.model.mapper;

import com.instagram.user.model.dto.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {

    // 사용자 생성
    void insertUser(User user);
    // 사용자 수정
    int updateUser(User user);
    // 사용자 삭제
    void deleteUser(int userId);
    // id로 사용자 조회
    User selectUserById(int userId);
    // 이름으로 사용자 조회
    String selectUserByUserName(String userName);
    // email로 사용자 조회
    User selectUserByUserEmail(String userEmail);
    // 비밀번호 확인
    User selectUserByUserPassword(String userPassword);
    // 모든 사용자 조회
    List<User> selectAllUsers();

    /**
     * 유저 이름으로 검색
     */
    List<User> searchUsersByUserName(@Param("query") String query);

    /**
     * 유저네임으로 정확히 일치하는 유저 조회
     */
    User selectUserByUserNameExact(String userName);
}
