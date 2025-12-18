import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {X, MoreHorizontal, Heart, Send, ChevronLeft, ChevronRight} from 'lucide-react';
import apiService from "../service/apiService";
import {formatDate, getImageUrl} from "../service/commonService";

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
/*
import React, { useEffect, useState, useMemo } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { X, MoreHorizontal, Heart, Send } from 'lucide-react';
import apiService from "../service/apiService";
import {formatDate, getImageUrl} from "../service/commonService";

const StoryDetail = () => {
    const navigate = useNavigate();
    const {userId} = useParams();

    // ********** 상태 변경 **********
    const [progress, setProgress] = useState(0);                    // 현재 스토리의 진행률 (0-100)
    const [storyList, setStoryList] = useState([]);                 // 백엔드에서 가져온 전체 스토리 목록 (List<Story>)
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);  // 현재 보고 있는 스토리의 인덱스
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');                     // 메시지 입력 상태
    // ****************************

    // 현재 표시해야 할 스토리 객체를 계산
    const currentStory = useMemo(() => {
        return storyList.length > 0 ? storyList[currentStoryIndex] : null;
    }, [storyList, currentStoryIndex]);

    // ********** 1. 스토리 데이터 로딩 **********
    const getStoryData = async () => {
        try {
            setLoading(true);
            console.log("apiService.getUserStories 시작");
            // 백엔드에서 List<Story>를 반환한다고 가정
            const res = await apiService.getUserStories(userId);
            console.log("res (Story List): ", res);

            if (res && Array.isArray(res) && res.length > 0) {
                // 가져온 스토리 목록을 상태에 저장
                setStoryList(res);
                setCurrentStoryIndex(0); // 항상 첫 번째 스토리부터 시작
            } else {
                // 스토리가 없는 경우
                alert("해당 유저의 활성 스토리가 없습니다.");
                navigate('/feed');
            }
        } catch (error) {
            console.error("스토리를 불러오는데 실패했습니다.", error);
            alert("스토리를 불러오는데 실패했습니다.");
            navigate('/feed');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getStoryData()
    },[userId]);
    // *****************************************


    // ********** 2. 진행 바 및 스토리 전환 로직 **********
    useEffect(() => {
        // 스토리 목록이 없거나 로딩 중이면 타이머를 시작하지 않습니다.
        if (storyList.length === 0 || loading || !currentStory) {
            return;
        }

        setProgress(0); // 새 스토리가 시작될 때마다 진행 바를 0으로 초기화

        const duration = 5000; // 스토리당 5초
        const intervalTime = 50;

        const timer = setInterval(() => {
            setProgress(prev => {
                const nextProgress = prev + (100 / (duration / intervalTime));

                if (nextProgress >= 100) {
                    clearInterval(timer);

                    // 현재 스토리가 마지막 스토리인지 확인
                    if (currentStoryIndex < storyList.length - 1) {
                        // 다음 스토리로 이동 (setCurrentStoryIndex가 상태를 업데이트하면 useEffect가 재실행됨)
                        setCurrentStoryIndex(prevIndex => prevIndex + 1);
                    } else {
                        // 마지막 스토리이면 피드 페이지로 이동
                        navigate('/feed');
                    }
                    return 100;
                }
                return nextProgress;
            });
        }, intervalTime);

        // 컴포넌트 언마운트 또는 currentStoryIndex가 변경될 때 타이머 정리
        return () => clearInterval(timer);

        // currentStoryIndex가 변경될 때마다 이 useEffect가 재실행되어 새 스토리의 타이머가 시작됩니다.
    }, [navigate, storyList, loading, currentStoryIndex, currentStory]);
    // ***************************************************


    if(loading) return <div>로딩중</div>;
    // currentStory가 없으면 (목록이 비었거나 로딩 후에도) 렌더링하지 않음 (이미 navigate 되었을 가능성이 높음)
    if (!currentStory) return null;


    // ********** 3. 렌더링 (currentStory 사용) **********
    return (
        <div className="story-viewer-container">
            <div
                className="story-bg-blur"
                style={{backgroundImage: `url(${getImageUrl(currentStory.storyImage)})`}}
            />

            <div className="story-content-box">
                <div className="story-progress-wrapper">
{storyList.map((story, index) => (
    <div key={story.storyId || index} className="story-progress-bar">
        <div
            className="story-progress-fill"
            style={{
                // 이미 본 스토리: 100% 채움
                width: index < currentStoryIndex ? '100%' :
                    // 현재 보는 스토리: progress %만큼 채움
                    index === currentStoryIndex ? `${progress}%` :
                        // 아직 보지 않은 스토리: 0%
                        '0%'
            }}
        ></div>
    </div>
))}
</div>

<div className="story-header-info">
    <div className="story-user">
        <img src={getImageUrl(currentStory.userImage)} alt="user"
             className="story-user-avatar" />
        <span className="story-username">
                            {currentStory.userName}
                        </span>
        <span className="story-time">
                            {formatDate(currentStory.createdAt, 'relative')}
                        </span>
    </div>
    <div className="story-header-actions">
        <MoreHorizontal color="white"
                        className="story-icon"/>
        <X
            color="white"
            className="story-icon"
            onClick={() => navigate('/feed')} // 단순히 뒤로가기 대신 피드로 이동
        />
    </div>
</div>

<img src={getImageUrl(currentStory.storyImage)}
     alt="story"
     className="story-main-image" />

<div className="story-footer">
    <div className="story-input-container">
        <input
            type="text"
            placeholder="메시지 보내기..."
            className="story-message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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

 */

const StoryDetailPage = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [stories, setStories] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true)
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const {userId} = useParams();
    // const {storyId} = useParams();
    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    const loginUserId = loginUser.userId;

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
            const res = await apiService.getUserStories(userId);
            console.log("res", res);
            // 데이터가 배열이가 1개 이상일 때
            if (Array.isArray(res) && res.length > 0) {
                setStories(res);
            } else {
                navigate(`/feed`);
            }
        } catch (error) {
            alert("스토리를 불러오는데 실패했습니다.");
            //navigate('/feed');
        } finally {
            setLoading(false);
        }
    }

    // 다음 스토리로 이동
    const goToNextStory = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setProgress(0);
        } else { //마지막 스토리면 창 닫고 피드로 이동 -> 다음 유저 스토리 보기
            navigate("/feed");
        }
    }
    // 이전 스토리로 이동 현재 번호에서 -1씩 감소
    const goToPrevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setProgress(0); // 다음 게시물로 넘어가거나 이전 게시물로 넘어가면 프로그래스바 처음부터 시작!
        } else {
            navigate("/feed");
        }
    }


    useEffect(() => {

        if (!stories.length) return;

        const duration = 5000;
        const intervalTime = 50;

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    goToNextStory(); // 다음 스토리 넘어가기
                    return 0; // 다음 스토리로 넘어갈 때 프로그래스바를 처음부터 다시 시작
                }
                return prev + (100 / (duration / intervalTime));
            });
        }, intervalTime);

        return () => clearInterval(timer);
        //  현재 바라보고 있는 페이지 번호 변경되거나, 배열이 추가될 때 감지
    }, [currentIndex, stories]);

    /*
    화면 클릭으로 이전 / 다음 이동
    화면 전체 너비 screenWidth 300
    왼쪽 1/3 구간
    0  ~ 100
    0 ~ screenWidth / 3

    가운데
    100              ~    200
    screenWidth / 3      (screenWidth / 3) * 2

    오른쪽 1/3 구간
    200                          ~ 300
     (screenWidth / 3) * 2        screenWidth
     */
    const handleScreenClick = (e) => {
        // 위쪽이나 아래쪽 클릭의 경우 상 하 y좌표 기준으로 클릭한다
        // 왼쪽이나 오른쪽 클릭의 경우 좌 우 x좌표 기준으로 클릭한다
        const clickX = e.clientX;
        const screenWidth = window.innerWidth;

        if (clickX < screenWidth / 3) {
            // x좌표 기준으로 왼쪽 1/3 정도의 가로를 클릭하면 - 이전 페이지
            goToPrevStory();
            //      사용자클릭이 전체 가로 너비 300 기준 200 이상 클릭했을 때
        } else if (clickX > (screenWidth * 2) / 3) {
            goToNextStory();
        }
    }

    if (loading) return <div>로딩중</div>;

    // 현재 스토리에 따른 유저 정보와 스토리ID
    const currentStory = stories[currentIndex];

    const handleDeleteStory = async () => {
        try {
            // deleteStory 에 현재스토리 스토리아이디 전달하여 스토리 삭제 sel delete 처리 하기
            // controller deleteStory
            await apiService.deleteStory(currentStory.storyId);

            //삭제 후 스토리 목록에서 제거
            const updateStories = stories.filter((_,index) => index !== currentIndex);
            // 스토리 없을 경우
            if(updateStories.length === 0){
                // 마지막 스토리를 삭제한 경우 피드로 이동
            } else {
                if(currentIndex >= updateStories.length){
                    setCurrentIndex(updateStories.length - 1);
                }
                setStories(updateStories);
                setProgress(0);
            }
            setShowDeleteModal(false);
        } catch (err) {
            alert("스토리 삭제에 실패했습니다.");
            console.error(err.message);
        }
    }

    return (
        <div className="story-viewer-container" onClick={handleScreenClick}> {/* 스토리 전체 화면에서 클릭이 일어날 수 있다. */}
            <div
                className="story-bg-blur"
                style={{backgroundImage: `url(${getImageUrl(currentStory.storyImage)})`}}
            />

            <div className="story-content-box">
                <div className="story-progress-wrapper">
                    {stories.map((_, index) => (
                        <div key={index} className="story-progress-bar">
                            <div className="story-progress-fill"
                                 style={{
                                     width: index < currentIndex
                                         ? '100%'
                                         : index === currentIndex
                                             ? `${progress}%`
                                             : '0%'
                                 }}>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="story-header-info">
                    <div className="story-user">
                        <img src={getImageUrl(currentStory.userAvatar)}
                             alt="user"
                             className="story-user-avatar"
                        />
                        <span className="story-username">
                            {currentStory.userName}
                        </span>
                        <span className="story-time">
                            {formatDate(currentStory.createdAt, 'relative')}
                        </span>
                    </div>
                    <div className="story-header-actions">
                        <MoreHorizontal color="white"
                                        className="story-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteModal(true);
                                        }}
                                        style={{
                                            cursor: 'point',
                                            display: (currentStory.userId === loginUserId
                                                ? 'block' : 'none')
                        }}
                        />
                        <X
                            color="white"
                            className="story-icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(-1);
                            }}
                        />
                    </div>
                </div>

                <img src={currentStory.storyImage}
                     alt="story"
                     className="story-main-image"/>
                {currentIndex > 0 &&(
                    <div className="story-nav-hint story-nev-left">
                        <ChevronLeft color="white" size={32} />
                    </div>
                )}
                {currentIndex > stories.length - 1 && (
                    <div className="story-nav-hint story-nev-right">
                        <ChevronRight color="white" size={32} />
                    </div>
                )}

                <div className="story-footer">
                    <div className="story-input-container">
                        <input
                            type="text"
                            placeholder="메시지 보내기..."
                            className="story-message-input"
                        />
                    </div>
                    <Heart color="white"
                           className="story-icon"/>
                    <Send color="white"
                          className="story-icon"/>
                </div>

            </div>
            {showDeleteModal && (
                <div
                    className="story-delete-modal-overlay"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal(false);
                    }}
                >
                    <div
                        className="story-delete-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="story-delete-button story-delete-confirm"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStory();
                            }}
                        >
                            스토리 삭제
                        </button>
                        <button
                            className="story-delete-button story-delete-cancel"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteModal(false);
                            }}
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default StoryDetailPage;