package com.instagram.like.model.mapper;

import com.instagram.like.model.dto.Like;
import com.instagram.post.model.dto.Post;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface LikeMapper {
    /**
     * 로그인 회원이 좋아요 누른 게시물 리스트
     * @param loginUserId
     * @return
     */
    List<Integer> selectLikePostId(int loginUserId);
    /**
     * 로그인 회원 특정 게시물 좋아요 유무 확인
     * @param like
     * @return
     */
    boolean selectLike(Like like);
    /**
     * 게시물을 좋아요 누른 사용자 수
     * @param postId
     * @return
     */
    int selectLikes(int postId);
    /**
     * 좋아요 추가
     * @param like
     * @return
     */
    boolean insertLike(Like like);
    /**
     * 좋아요 삭제
     * @param like
     * @return
     */
    boolean deleteLike(Like like);

    List<Integer> selectLikesByUserId(int userId);
}
