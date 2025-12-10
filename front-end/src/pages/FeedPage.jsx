// ============================================
// src/pages/FeedPage.jsx
// TODO: 피드 페이지 UI 및 기능 구현
// - posts, stories, loading state 선언
// - useEffect로 컴포넌트 마운트 시 데이터 로드
// - loadFeedData 함수: getPosts, getStories 호출
// - toggleLike 함수: addLike/removeLike 호출 후 목록 새로고침
// - handleLogout 함수: 확인 후 로그아웃
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Home, PlusSquare, Film, User } from 'lucide-react';
import Header from "../components/Header";
import {getImageUrl} from "../service/commonService";

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadFeedData()
    }, []);

    const loadFeedData = async () => {
        setLoading(true);
        try {
            const postRes = await apiService.getPosts();
            setPosts(postRes);
        } catch (error) {
            alert("포스트를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
        try {
            const storyRes = await apiService.getStories();
            setStories(storyRes);
        } catch (error) {
            alert("스토리를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (postId, isLiked) => {
        /*
        좋아요 누르면 화면에 반영되지만
        취소는 백그라운드에서 작업될 뿐 화면에 바로 보이지 않는 상황이다.
        소비자에게 백엔드 속도는 중요하지 않고, 눈 앞에 보여지는 화면의 속도가 우선이므로
        프론트엔드에서 바뀌는 작업을 보인 후 백엔드로 로직 진행한다.
        실패할 경우 카운트 원상 복구 후 소비자에게 전달한다.
         */
        /*
        현재 게시물 목록 복사한다.
        클릭한 게시물이 몇 번째인지 찾는다.
        게시물 찾았다면 좋아요 상태를 반대로 뒤집는다 (true -> false)
        숫자 취소는 -1, 추가는 +1
        변경된 상태로 화면에 반영한다.
         */
        const newPosts = [...posts];
        const targetIndex = newPosts.findIndex(post => post.postId === postId);
        if(targetIndex !== -1) {
            newPosts[targetIndex].isLiked = !isLiked;
            if(isLiked) --newPosts[targetIndex].likeCount;
            else ++newPosts[targetIndex].likeCount;
            setPosts(newPosts);
        }
        try {
            if (isLiked) {
                await apiService.removeLike(postId);
            } else {
                await apiService.addLike(postId);
            }
            /*
            기존에는 백엔드에서 프론트엔드로 변경했다면
            수정내용은 프론트엔드에서 백엔드 로직
            const postsData = await apiService.getPosts();
            setPosts(postsData);
             */
        } catch (error) {
            alert("좋아요 처리에 실패했습니다.");
        }
    };

    if (loading) {
        return (
            <div className="feed-container">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    로딩 중...
                </div>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <Header />
            <div className="feed-content">
                {stories.length > 0 && (
                    <div className="stories-container">
                        <div className="stories-wrapper">
                            {stories.map((story) => (
                                <div key={story.storyId}
                                     className="story-item"
                                     onClick={() =>
                                         navigate(`/story/detail/${story.userId}`)}>
                                    <div className="story-avatar-wrapper"
                                         key={story.id}>
                                        <img src={story.userAvatar}
                                             className="story-avatar"/>
                                    </div>
                                    <span className="story-username">
                                        {story.userName}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {posts.length > 0 && (
                    posts.map((post) => (
                        <article key={post.postId} className="post-card">
                            <div className="post-header">
                                <div className="post-user-info">
                                    <img src={post.userAvatar} className="post-user-avatar"/>
                                    <span className="post-username">{post.userName}</span>
                                </div>
                                <MoreHorizontal className="post-more-icon" />
                            </div>

                            <img src={getImageUrl(post.postImage)} className="post-image" />
                            <div className="post-content">
                                <div className="post-actions">
                                    <div className="post-actions-left">
                                        <Heart
                                            className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                            onClick={() => toggleLike(post.postId, post.isLiked)}
                                            fill={post.isLiked ? "#ed4956" : "none"}
                                        />
                                        <MessageCircle className="action-icon" />
                                        <Send className="action-icon" />
                                    </div>
                                    <Bookmark className="action-icon" />
                                </div>

                                <div className="post-likes">
                                    좋아요 {post.likeCount}개
                                </div>

                                <div className="post-caption">
                                    <span className="post-caption-username">{post.userName}</span>
                                    {post.postCaption}
                                </div>
                                {post.commentCount > 0 && (
                                    <button className="post-comments-btn">
                                        댓글{post.commentCount}개 모두 보기
                                    </button>
                                )}
                                <div className="post-time">
                                    {post.createdAt ||'방금 전'}
                                </div>
                            </div>
                        </article>
                    ))
                )}
                {posts.length === 0 && !loading && (
                    <div className="no-posts-message">
                        <p>게시물이 없습니다. 새로운 콘텐츠를 등록하거나 팔로우해보세요!</p>
                        <button onClick={() => navigate('/upload')}
                                style={{ marginTop: '10px' }}
                        >
                            <PlusSquare size={16} style={{ marginRight: '5px' }} />
                            새 게시물 등록
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedPage;