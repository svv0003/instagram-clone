package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;

public interface UserService {

    void signUp(User user);
    void login(String userName, String userPassword);
    User getUserByUserEmail(String userEmail);
    User getUserByUserName(String userName);
}
