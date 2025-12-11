package com.instagram.story.model.mapper;

import com.instagram.story.model.dto.Story;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StoryMapper {
    void insertStory(Story story);
    void updateStory(int storyId, String storyImage);
    List<Story> selectAllStories();

    /**
     * 24시간 이내 스토리 계정 조회
     * @return
     */
    List<Story> selectAllStoriesForOneDay();
    List<Story> selectStoriesByUserId(int userId);
    void deleteStory(int storyId);
    Story selectStoryByStoryId(int StoryId);
}
