package com.instagram.story.controller;

import com.instagram.common.util.JwtUtil;
import com.instagram.post.model.dto.Post;
import com.instagram.post.model.service.PostService;
import com.instagram.story.model.dto.Story;
import com.instagram.story.model.service.StoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stories")
public class StoryController {
    private final StoryService storyService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createStory(@RequestPart("storyImage") MultipartFile storyImage,
                                         @RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.substring(7);
            int userId = jwtUtil.getUserIdFromToken(jwtToken);
            Story story = storyService.createStory(userId, storyImage);
            Map<String, Object> map = new HashMap<>();
            map.put("story", story);
            map.put("msg", "스토리가 성공적으로 생성되었습니다.");
            return ResponseEntity.ok(map);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("파일 업로드 실패 : " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("스토리 업로드 실패 : " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<?> getAllStories(){
        try{
            List<Story> stories = storyService.getAllStories();
            return  ResponseEntity.ok(stories);
        } catch (Exception e){
            return ResponseEntity.badRequest().body("스토리 조회 실패 : "+e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getStory(@PathVariable("userId") int userId){
        try{
            List<Story> a = storyService.getStoriesByUserId(userId);
            return  ResponseEntity.ok(a);
        } catch (Exception e){
            return ResponseEntity.badRequest().body("스토리 조회 실패 : "+e.getMessage());
        }
    }

//    @GetMapping("/{storyId}")
//    public ResponseEntity<?> getStoryByStoryId(@PathVariable("storyId") int storyId){
//        try{
//            Story a = storyService.getStoriesByStoryId(storyId);
//            return  ResponseEntity.ok(a);
//        } catch (Exception e){
//            return ResponseEntity.badRequest().body("스토리 조회 실패 : "+e.getMessage());
//        }
//    }

//    @DeleteMapping("/{userId}/{storyId}")
    @DeleteMapping("/{storyId}")
    public ResponseEntity<?> deleteStory(
//            @RequestHeader("Authorization") String token,
//            @PathVariable int userId,
            @PathVariable int storyId){
        try {
            log.info("삭제 시도");
//            String jwtToken = token.substring(7);
//            int loginUserId = jwtUtil.getUserIdFromToken(jwtToken);
//            log.info("loginUserId : {}, story.getUserId : {} ", loginUserId, userId);
//            if(loginUserId != userId) {
//                log.info("본인 스토리 아닙니다.");
//                return ResponseEntity.badRequest().body("본인 스토리만 삭제 가능하니다.");
//            }
            log.info("스토리 삭제 서비스 시도.");
            storyService.deleteStory(storyId);
            return  ResponseEntity.ok(true);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("스토리 조회 실패 : " + e.getMessage());
        }
    }
}
