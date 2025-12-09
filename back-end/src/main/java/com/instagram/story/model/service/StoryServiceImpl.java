package com.instagram.story.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.story.model.dto.Story;
import com.instagram.story.model.mapper.StoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryServiceImpl implements StoryService {
    private final StoryMapper storyMapper;
    private final FileUploadService fileUploadService;

    @Override
    public Story createStory(int userId, MultipartFile storyImage) throws IOException {
        log.info("스토리 생성 시작 - 사용자ID: {}, storyImage: {}", userId, storyImage);
        log.info("new Story 생성");
        Story story = new Story();
        story.setUserId(userId);
        story.setStoryImage("default-story-image");
        log.info("insertStory(story) 시작");
        storyMapper.insertStory(story);
        log.info("임시 스토리 생성 완료 - 스토리ID: {}", story.getStoryId());
        String imageUrl = fileUploadService.uploadStoryImage(storyImage, story.getStoryId(), "story");
        story.setStoryImage(imageUrl);
        storyMapper.updateStory(story.getStoryId(), imageUrl);
        return story;
    }

    @Override
    public List<Story> getAllStories() {
        log.info("모든 활성 스토리 조회");
        List<Story> stories = storyMapper.selectAllStories();
        log.info("조회된 스토리 개수: {}", stories.size());
        return stories;
    }

    @Override
    public Story getStoriesByUserId(int userId) {
        log.info("특정 사용자 스토리 조회 - 사용자ID: {}", userId);
        Story story = new Story();
        return story;
    }

    @Override
    public Story getStoriesByStoryId(int storyId) {
        log.info("특정 스토리 조회 - 스토리ID: {}", storyId);
        Story story = storyMapper.selectStoriesByStoryId(storyId);
        return story;
    }

    @Override
    public void deleteExpiredStories() {

    }
}
