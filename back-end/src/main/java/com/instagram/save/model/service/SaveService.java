package com.instagram.save.model.service;

import java.util.List;

public interface SaveService {
    List<Integer> getSavePostId(int loginUserId);
    boolean checkSave(int postId, int loginUserId);
    boolean addSave(int postId, int loginUserId);
    boolean deleteSave(int postId, int loginUserId);
    List<Integer> getSavesByUserId(int userId);
}
