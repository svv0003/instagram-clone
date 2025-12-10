package com.instagram.story.model.mapper;

import com.instagram.story.model.dto.Story;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StoryMapper {
    void insertStory(Story story);
    void updateStory(int storyId, String storyImage);
    List<Story> selectAllStories();
    Story selectStoryByUserId(int userId);
    Story selectStoriesByStoryId(int StoryId);
}
