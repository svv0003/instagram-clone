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
import {Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Trash2} from 'lucide-react';
import Header from "../components/Header";
import {getImageUrl} from "../service/commonService";
import MentionInput from "../components/MentionInput";
import MentionText from "../components/MentionText";
import SearchModal from "../components/SearchModal";
import PostDetailModal from "../components/PostDetailModal";
import {post} from "axios";

const SingleFeedPage = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const currentUser = JSON.parse(localStorage.getItem("user") || '[]');
    const {postId} = useParams();

    useEffect(() => {
        console.log("postId :", postId);
        loadFeedData(postId);
        loadComments();
    }, [postId]);

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

    const loadComments = async () => {
        try {
            const res = await apiService.getComments(postId);
            console.log("res :", res);
            setComments(res.comments);
        } catch (error) {
            alert("댓글을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if(!window.confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await apiService.deleteComment(commentId);
            console.log("res :", res);
            setComments(prev => prev.filter(c => c.commentId !== commentId));
        } catch (error) {
            alert("댓글 삭제를 실패했습니다.");
        }
    };

    const handleCommentSubmit = async (postId, commentText) => {
        try {
            const res = await apiService.createComment(postId, commentText);
            console.log("res :", res);
            const postRes = await apiService.getComments(postId);
            setComments(postRes.comments || postRes);
            setCommentText('');
            setPost(prev => ({
                ...prev,
                commentCount: ++prev.commentCount
            }));
        } catch (error) {
            alert("댓글 삭제를 실패했습니다.");
        }
    };

/*

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
 */
    const toggleLike = async () => {
        if (!post) return;
        // 낙관적 업데이트
        setPost(prev => ({
            ...prev,
            isLiked: !prev.isLiked,
            likeCount: prev.isLiked ? --prev.likeCount : ++prev.likeCount
        }));

        try {
            if (post.isLiked) {
                await apiService.removeLike(post.postId);
            } else {
                await apiService.addLike(post.postId);
            }
        } catch (error) {
            // 실패 시 롤백
            setPost(post);
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

    if (!post) {
        return (
            <div className="feed-container">
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                    게시물을 찾을 수 없습니다.
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
                                 className="post-user-avatar"
                                 onClick={() =>
                                     navigate(`/myfeed?userId=${post.userId}`)}
                                 style={{cursor: 'pointer'}}/>
                            <span className="post-username"
                                  onClick={() =>
                                      navigate(`/myfeed?userId=${post.userId}`)}
                                  style={{cursor: 'pointer'}}>
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

                        <div className="comments-section">
                            {comments.length === 0 ? (
                                <div className="comments-empty">
                                    첫 댓글을 달아보세요!
                                </div>
                            ):(
                                comments.map((comment, i) => (
                                    <div key={i} className="comment-item">
                                        <img className="comment-avatar"
                                             src={comment.userAvatar}/>
                                        <div className="comment-content">
                                            <div className="comment-text">
                                                <span className="comment-username"></span>
                                                <MentionText text={comment.commentContent} />
                                            </div>
                                            <div className="comment-time">
                                                {comment.createdAt}
                                            </div>
                                        </div>
                                        {currentUser.userId === comment.userId &&(
                                            <Trash2 size={16}
                                                    className="comment-delete-btn"
                                                    onClick={() =>
                                                        handleDeleteComment(comment.commentId)} />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        {post.commentCount > 0 && (
                            <button className="post-comments-btn"
                                    onClick={() =>
                                        navigate(`/post/${post.postId}`)}>
                                댓글{post.commentCount}개 모두 보기
                            </button>
                        )}
                        <div className="post-time">
                            {post.createdAt || '방금 전'}
                        </div>
                    </div>
                    <div className="comment-input-container">
                        <input className="comment-input"
                               placeholder="댓글 작성하기"
                               onChange={(e) =>
                                   setCommentText(e.target.value)}
                               value={commentText}/>
                        <button className="comment-post-btn"
                                onClick={() => handleCommentSubmit(post.postId, commentText)}
                                style={{opacity: commentText.trim() ? 1 : 0.3}}>
                            게시
                        </button>
                    </div>
                </article>
            </div>
            {selectedPost && (
                <PostDetailModal
                    post={selectedPost}
                    currentUserId={currentUser.userId}
                    onClose={() => setSelectedPost(null)}
                    onDelete={deletePost}
                    onToggleLike={toggleLike}
                />
            )}
        </div>
    );
};

export default SingleFeedPage;