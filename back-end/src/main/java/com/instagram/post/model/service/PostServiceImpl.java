package com.instagram.post.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;
    private final FileUploadService fileUploadService;

    @Override
    public List<Post> getAllPosts(int currentUserId) {
        List<Post> p = postMapper.selectAllPosts(currentUserId);
        return p;
    }

    @Override
    public Post getPostById(int postId, int currentUserId) {
        return postMapper.selectPostById(postId, currentUserId);
    }

    @Override
    public boolean createPost(MultipartFile postImage, String postCaption, String postLocation, int currentUserId) {
        /*
        게시물이 1개라도 등록되면 true, 0 이하는 false
         */
        try {
            Post post = new Post();
            post.setUserId(currentUserId);
            post.setPostCaption(postCaption);
            post.setPostLocation(postLocation);
            post.setPostImage("");
            log.info("current user id:{}", currentUserId);
            log.info("postCaption:{}", postCaption);
            log.info("postLocation:{}", postLocation);
            //
            int result = postMapper.insertPost(post);
            log.info("result :{}", result);
            if(result > 0){
                String imageUrl = fileUploadService.uploadPostImage(postImage, result, "post");
                post.setPostImage(imageUrl);
                postMapper.updatePost(post);
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            log.error("게시물 작성 실패 : ", e);
            return false;
        }
    }

    @Override
    public boolean deletePost(int postId) {
        return postMapper.deletePost(postId) > 0;
    }

    @Override
    public List<Post> getPostsByUserId(int userId, int currentUserId) {
        return postMapper.selectPostsByUserId(userId, currentUserId);
    }

    @Override
    public boolean addLike(int postId, int userId) {
        return postMapper.insertLike(postId, userId) > 0;
    }

    @Override
    public boolean deleteLike(int postId, int userId) {
        return postMapper.deleteLike(postId, userId) > 0;
    }
}
