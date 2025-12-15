// ============================================
// src/pages/FeedPage.jsx
// TODO: 피드 페이지 UI 및 기능 구현
// - posts, stories, loading state 선언
// - useEffect로 컴포넌트 마운트 시 데이터 로드
// - loadFeedData 함수: getPosts, getStories 호출
// - toggleLike 함수: addLike/removeLike 호출 후 목록 새로고침
// - handleLogout 함수: 확인 후 로그아웃
// ============================================

import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import apiService from '../service/apiService';
import {Heart, MessageCircle, Send, Bookmark, MoreHorizontal} from 'lucide-react';
import Header from "../components/Header";
import {getImageUrl} from "../service/commonService";
import MentionInput from "../components/MentionInput";
import MentionText from "../components/MentionText";
import SearchModal from "../components/SearchModal";
import PostDetailModal from "../components/PostDetailModal";

const SingleFeedPage = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const currentUser = JSON.parse(localStorage.getItem("user") || '[]');
    const {postId} = useParams();

    useEffect(() => {
        console.log("postId :", postId);
        loadFeedData(postId)
    }, []);

    const loadFeedData = async (postId) => {
        setLoading(true);
        try {
            const res = await apiService.getPost(postId);
            console.log("res :", res);
            setPost(res);
        } catch (error) {
            alert("포스트를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };


    const toggleLike = async (postId, isLiked) => {
        const newPosts = [...post];
        const targetIndex = newPosts.findIndex(post => post.postId === postId);
        if(targetIndex !== -1) {
            newPosts[targetIndex].isLiked = !isLiked;
            if(isLiked) --newPosts[targetIndex].likeCount;
            else ++newPosts[targetIndex].likeCount;
            setPost(newPosts);
        }
        try {
            if (isLiked) {
                await apiService.removeLike(postId);
            } else {
                await apiService.addLike(postId);
            }
        } catch (error) {
            alert("좋아요 처리에 실패했습니다.");
        }
    };

    const deletePost = async (postId) => {
        try {
            await apiService.deletePost(postId);
            setPost(post.filter(p => p.postId !== postId));
            setSelectedPost(null);
            alert("게시물이 삭제되었습니다.");
        } catch (err) {
            alert("게시물 삭제에 실패했습니다.");
        }
    }

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
            <Header/>
            <div className="feed-content">
                <article className="post-card">
                    <div className="post-header">
                        <div className="post-user-info">
                            <img src={getImageUrl(post.userAvatar)}
                                 className="post-user-avatar"/>
                            <span className="post-username"
                                  onClick={() =>
                                      navigate(`/myfeed?userId=${post.userId}`)}>
                                {post.userName}
                            </span>
                        </div>
                        <MoreHorizontal className="post-more-icon"/>
                    </div>

                    <img src={post.postImage}
                         className="post-image"
                         style={{cursor:'pointer'}}
                    />
                    <div className="post-content">
                        <div className="post-actions">
                            <div className="post-actions-left">
                                <Heart
                                    className={`action-icon like-icon ${post.isLiked ? 'liked' : ''}`}
                                    onClick={() =>
                                        toggleLike(post.postId, post.isLiked)}
                                    fill={post.isLiked ? "#ed4956" : "none"}
                                />
                                <MessageCircle className="action-icon"/>
                                <Send className="action-icon"/>
                            </div>
                            <Bookmark className="action-icon"/>
                        </div>

                        <div className="post-likes">
                            좋아요 {post.likeCount}개
                        </div>

                        <div className="post-caption">
                            <span className="post-caption-username">
                                {post.userName}
                            </span>
                            <MentionText text={post.postCaption} />
                        </div>

                        {post.commentCount > 0 && (
                            <button className="post-comments-btn">
                                댓글{post.commentCount}개 모두 보기
                            </button>
                        )}
                        <div className="post-time">
                            {post.createdAt || '방금 전'}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default SingleFeedPage;