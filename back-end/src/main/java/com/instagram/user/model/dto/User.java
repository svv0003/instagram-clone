package com.instagram.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    /*
    userId의 경우 int지만 String은 다른 자료형도 받을 수 있기 때문에
    회사에서는 주로 String으로 설정하고, 사용할 때는 형변환처리한다.
    String으로 처리하여 사용해보자.
     */
    private int userId;
    private String userName;
    private String userEmail;
    private String userPassword;
    private String userFullname;
    private String userAvatar;
    private String createdAt;
    private String updatedAt;
}
