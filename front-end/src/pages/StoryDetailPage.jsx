import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { X, MoreHorizontal, Heart, Send } from 'lucide-react';
import apiService from "../service/apiService";
import {getImageUrl} from "../service/commonService";

/*
GET
1. mapper.xml
2. mapper.java
3. service.java
4. serviceImpl.java
5. restcontroller.java
    순서로 작업 후 postman 또는 백엔드 api/endpoint 주소에서 데이터 가져오는지 확인한다.
    APIService.js에서 백엔드 데이터 전달받는 작업
    각 jsx에서 api로 가져온 데이터를 화면에 보여주는 작업
    이후 세부사항 JS 작업 진행한다.

POST
백엔드에서 확인하는 방법이 익숙치 않은 경우
프론트 -> 백엔드 순서로 작업한다.
 */
/**
 * commonService 에 현재 날짜를 몇 시간 전에 업로드했는지 formatDate 메서드 사용하여 날짜 변환
 *  <span className="story-time">
 *        {storyData.createdAt}
 *  </span>
 *
 *  formatDate 형태로 1시간 1분전 업로드형태 수정
 *  or
 *  formatDate 형태로 yyyy-mm-dd 형태로 확인 수정
 */


const StoryDetail = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [storyData, setStoryData] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true)
    const {userId} = useParams();
    // const {storyId} = useParams();

    useEffect(() => {
        getStoryData()
    },[userId]);

    const getStoryData = async () => {
        try {
            setLoading(true);
            /*
            Story는 선택하여 보는 것이 아니라 오래된 순서부터 나열되어 순차적으로 보여주는 방식이다.
            유저 프로필 클릭하지 않으면 알 수 없기 때문에 storyId로 조회하는 것이 아닌 userId로 조회해야 한다.
            const res = await apiService.getStoryByStoryId(storyId);
            setStoryData({
                username: res.userName,
                userImage: res.userAvatar,
                storyImage: res.storyImage,
                uploadedAt: res.createdAt,
            });
             */
            console.log("apiService.getUserStories 시작");
            const res = await apiService.getUserStories(userId);
            console.log("res", res);
            setStoryData(res);
        } catch (error) {
            alert("스토리를 불러오는데 실패했습니다.");
            navigate('/feed');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!storyData) return navigate('/feed');
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
    }, [navigate]);


    if(loading) return <div>로딩중</div>;

    return (
        <div className="story-viewer-container">
            <div
                className="story-bg-blur"
                style={{backgroundImage: `url(${getImageUrl(storyData.storyImage)})`}}
            />

            <div className="story-content-box">
                <div className="story-progress-wrapper">
                    <div className="story-progress-bar">
                        <div className="story-progress-fill"
                             style={{width: `${progress}%`}}></div>
                    </div>
                </div>

                <div className="story-header-info">
                    <div className="story-user">
                        <img src={getImageUrl(storyData.userImage)} alt="user"
                             className="story-user-avatar" />
                        <span className="story-username">
                            {storyData.userName}
                        </span>
                        <span className="story-time">
                            {storyData.createdAt}
                        </span>
                    </div>
                    <div className="story-header-actions">
                        <MoreHorizontal color="white"
                                        className="story-icon"/>
                        <X
                            color="white"
                            className="story-icon"
                            onClick={() => navigate(-1)}
                        />
                    </div>
                </div>

                <img src={getImageUrl(storyData.storyImage)}
                     alt="story"
                     className="story-main-image" />

                <div className="story-footer">
                    <div className="story-input-container">
                        <input
                            type="text"
                            placeholder="메시지 보내기..."
                            className="story-message-input"
                        />
                    </div>
                    <Heart color="white"
                           className="story-icon" />
                    <Send color="white"
                          className="story-icon" />
                </div>
            </div>
        </div>
    );
};

export default StoryDetail;