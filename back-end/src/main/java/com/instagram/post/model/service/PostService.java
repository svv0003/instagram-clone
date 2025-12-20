package com.instagram.post.model.service;

import com.instagram.post.model.dto.Post;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PostService {

    /**
     * 모든 게시물 조회하기
     * 로그인 시 본인이 팔로우하는 지인 게시물
     * @param currentUserId
     * @return
     */
    List<Post> getAllPosts(int currentUserId);
    /**
     * 본인 피드 또는 특정 유저 피드 클릭 시 상세보기
     * @param postId
     * @return
     */
    Post getPostById(int postId);
    /**
     * 본인 피드 또는 특정 유저 프로필 클릭 시 피드 목록 상세보기
     * @return
     */
    List<Integer> getPostsByUserId(int userId);
    boolean createPost(MultipartFile postImage, String postCaption, String postLocation, int currentUserId);
    boolean deletePost(int postId);
    boolean addLike(int postId, int userId);
    boolean deleteLike(int postId, int userId);
    String getPostImage(int postId);
}
