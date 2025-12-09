import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { X, MoreHorizontal, Heart, Send } from 'lucide-react';
import apiService from "../service/apiService";

const StoryDetail = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const {storyId} = useParams();
    const [storyData, setStoryData] = useState({
        username: "Loading...",
        userImage: "https://via.placeholder.com/50",
        storyImage: "https://picsum.photos/600/1000",
        uploadedAt: "..."
    });

    const getStoryData = async () => {
        try {
            const res = await apiService.getStoryByStoryId(storyId);
            setStoryData({
                username: res.userName,
                userImage: res.userAvatar,
                storyImage: res.storyImage,
                uploadedAt: res.createdAt,
            });
        } catch (error) {
            alert("스토리를 불러오는데 실패했습니다.");
        }
    }

    useEffect(() => {
        getStoryData();
        const duration = 5000;
        const intervalTime = 50;
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    // navigate(-1);
                    navigate('/feed');
                    return 100;
                }
                return prev + (100 / (duration / intervalTime));
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [storyId]);

    return (
        <div className="story-viewer-container">
            <div
                className="story-bg-blur"
                style={{backgroundImage: `url(${storyData.storyImage})`}}
            />

            <div className="story-content-box">
                <div className="story-progress-wrapper">
                    <div className="story-progress-bar">
                        <div className="story-progress-fill" style={{width: `${progress}%`}}></div>
                    </div>
                </div>

                <div className="story-header-info">
                    <div className="story-user">
                        <img src={storyData.userImage} alt="user" className="story-user-avatar" />
                        <span className="story-username">{storyData.username}</span>
                        <span className="story-time">{storyData.uploadedAt}</span>
                    </div>
                    <div className="story-header-actions">
                        <MoreHorizontal color="white" className="story-icon"/>
                        <X
                            color="white"
                            className="story-icon"
                            onClick={() => navigate(-1)}
                        />
                    </div>
                </div>

                <img src={storyData.storyImage} alt="story" className="story-main-image" />

                <div className="story-footer">
                    <div className="story-input-container">
                        <input
                            type="text"
                            placeholder="메시지 보내기..."
                            className="story-message-input"
                        />
                    </div>
                    <Heart color="white" className="story-icon" />
                    <Send color="white" className="story-icon" />
                </div>
            </div>
        </div>
    );
};

export default StoryDetail;