package com.instagram.save.model.mapper;

import com.instagram.save.model.dto.Save;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SaveMapper {
    /**
     * 로그인 회원이 저장한 게시물 리스트
     * @param loginUserId
     * @return
     */
    List<Integer> selectSavePostId(int loginUserId);
    /**
     * 로그인 회원 특정 게시물 저장 유무 확인
     * @param save
     * @return
     */
    boolean selectSave(Save save);
    /**
     * 저장 추가
     * @param save
     * @return
     */
    boolean insertSave(Save save);
    /**
     * 저장 삭제
     * @param save
     * @return
     */
    boolean deleteSave(Save save);

    List<Integer> selectSavesByUserId(int userId);
}
