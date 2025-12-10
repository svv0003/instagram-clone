package com.instagram.user.model.service;

import com.instagram.user.model.dto.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UserService {

    void signUp(User user);
    User login(String userName, String userPassword);
    User getUserByUserEmail(String userEmail);
    User getUserByUserName(String userName);
    User getUserByUserId(int userId);
    User updateUser(User user, MultipartFile file) throws IOException;
}
