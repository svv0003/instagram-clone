package com.instagram.save.model.service;

import com.instagram.like.model.dto.Like;
import com.instagram.save.model.dto.Save;
import com.instagram.save.model.mapper.SaveMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SaveServiceImpl implements SaveService {

    private final SaveMapper saveMapper;

    /**
     *
     * @param loginUserId
     * @return
     */
    @Override
    public List<Integer> getSavePostId(int loginUserId) {
        return saveMapper.selectSavePostId(loginUserId);
    }

    /**
     * 팔로우 유무 확인
     * @param postId
     * @param loginUserId
     * @return
     */
    @Override
    public boolean checkSave(int postId, int loginUserId) {
        Save save = new Save();
        save.setPostId(postId);
        save.setUserId(loginUserId);
        return saveMapper.selectSave(save);
    }

    @Override
    public boolean addSave(int postId, int loginUserId) {
        try {
            Save save = new Save();
            save.setPostId(postId);
            save.setUserId(loginUserId);
            return saveMapper.insertSave(save);
        } catch (Exception e) {
            log.error("저장 반영 문제 발생 : {}", e);
            return false;
        }
    }

    @Override
    public boolean deleteSave(int postId, int loginUserId) {
        try {
            Save save = new Save();
            save.setPostId(postId);
            save.setUserId(loginUserId);
            return saveMapper.deleteSave(save);
        } catch (Exception e) {
            log.error("저장 취소 문제 발생 : {}", e);
            return false;
        }
    }

    @Override
    public List<Integer> getSavesByUserId(int userId) {
        List<Integer> res = saveMapper.selectSavesByUserId(userId);
        return res;
    }
}