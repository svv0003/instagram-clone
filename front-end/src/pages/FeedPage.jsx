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
import {useNavigate} from 'react-router-dom';
import apiService from '../service/apiService';
import {Heart, MessageCircle, Send, Bookmark, MoreHorizontal} from 'lucide-react';
import Header from "../components/Header";
import {getImageUrl} from "../service/commonService";
import MentionInput from "../components/MentionInput";
import MentionText from "../components/MentionText";
import SearchModal from "../components/SearchModal";
import PostDetailModal from "../components/PostDetailModal";
import PostOptionMenu from "../components/PostOptionMenu";

const FeedPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);
    const [followings, setFollowings] = useState([]);
    const [likes, setLikes] = useState([]);
    const loginUser = JSON.parse(localStorage.getItem("user") || '[]');
    const loginUserId = loginUser.userId;

    useEffect(() => {
        loadFeedData()
    }, []);

    const loadFeedData = async () => {
        setLoading(true);
        try {
            const postRes = await apiService.getPosts();
            setPosts(postRes);
            const storyRes = await apiService.getStories();
            setStories(storyRes);
            const followingRes = await apiService.getFollowingList();
            setFollowings(followingRes || []);
            const likeRes = await apiService.getLikeList();
            setLikes(likeRes || []);
        } catch (error) {
            alert("데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // /**
    //  * 사용자별로 스토리를 그룹화하고 가장 최근 스토리만 반환한다.
    //  * select * from story 에서 가져온 모든 데이터를  storiesData 변수에 전달
    //  * @param storiesData
    //  * @returns {unknown[]}
    //  */
    // const groupStoriesByUser = (storiesData) => {
    //     const userStoriesMap = {}; // 추후 유저들을 그룹화해서 담을 변수 공간
    //     // db에서 가져온 모든 스토리를 for 문으로 순회
    //     storiesData.forEach(story => {
    //         const userId = story.userId; // 각 스토리에 해당하는 유저 아이디를 변수이름에 담아
    //         // 해당 사용자의 첫 스토리이거나, 더 최근 스토리인 경우 스토리 유저 나열 순서를 맨 앞으로 이동
    //         // 정렬 = 알고리즘
    //         if (!userStoriesMap[userId]
    //             ||
    //             new Date(story.createdAt) > new Date(userStoriesMap[userId].createdAt)
    //         ) {
    //             userStoriesMap[userId] = story;
    //         }
    //     });
    //     // 위에서 그룹화한 userStoriesMap 유저들을 배열로 변환하고 최신순으로 정렬
    //     // 정렬 = 알고리즘
    //     return Object.values(userStoriesMap).sort((a, b) =>
    //         new Date(b.createdAt) - new Date(a.createdAt)
    //     );
    // }

    // const toggleLike = async (postId, isLiked) => {
    //     /*
    //     좋아요 누르면 화면에 반영되지만
    //     취소는 백그라운드에서 작업될 뿐 화면에 바로 보이지 않는 상황이다.
    //     소비자에게 백엔드 속도는 중요하지 않고, 눈 앞에 보여지는 화면의 속도가 우선이므로
    //     프론트엔드에서 바뀌는 작업을 보인 후 백엔드로 로직 진행한다.
    //     실패할 경우 카운트 원상 복구 후 소비자에게 전달한다.
    //      */
    //     /*
    //     현재 게시물 목록 복사한다.
    //     클릭한 게시물이 몇 번째인지 찾는다.
    //     게시물 찾았다면 좋아요 상태를 반대로 뒤집는다 (true -> false)
    //     숫자 취소는 -1, 추가는 +1
    //     변경된 상태로 화면에 반영한다.
    //      */
    //     const newPosts = [...posts];
    //     const targetIndex = newPosts.findIndex(post => post.postId === postId);
    //     if(targetIndex !== -1) {
    //         newPosts[targetIndex].isLiked = !isLiked;
    //         if(isLiked) --newPosts[targetIndex].likeCount;
    //         else ++newPosts[targetIndex].likeCount;
    //         setPosts(newPosts);
    //     }
    //     try {
    //         if (isLiked) {
    //             await apiService.removeLike(postId);
    //         } else {
    //             await apiService.addLike(postId);
    //         }
    //         /*
    //         기존에는 백엔드에서 프론트엔드로 변경했다면
    //         수정내용은 프론트엔드에서 백엔드 로직
    //         const postsData = await apiService.getPosts();
    //         setPosts(postsData);
    //          */
    //     } catch (error) {
    //         alert("좋아요 처리에 실패했습니다.");
    //     }
    // };

    // 좋아요 토글 함수
    const toggleLike = async (targetPostId) => {
        const isLike = likes.includes(targetPostId);
        if (isLike) {
            setLikes(prev => prev.filter(id => id !== targetPostId));
        } else {
            setLikes(prev => [...prev, targetPostId]);
        }
        setPosts(prevPosts => {
            return prevPosts.map(post => {
                if (post.postId === targetPostId) {
                    return {
                        ...post,
                        likeCount: isLike
                            ? post.likeCount - 1
                            : post.likeCount + 1,
                    };
                }
                return post;
            });
        });
        try {
            if (isLike) {
                await apiService.deleteLike(targetPostId);
            } else {
                await apiService.createLike(targetPostId);
            }
        } catch (error) {
            if (isLike) {
                setLikes(prev => [...prev, targetPostId]);
            } else {
                setLikes(prev => prev.filter(id => id !== targetPostId));
            }
            setPosts(prevPosts => {
                return prevPosts.map(post => {
                    if (post.postId === targetPostId) {
                        return {
                            ...post,
                            likeCount: isLike ? post.likeCount + 1 : post.likeCount - 1,
                        };
                    }
                    return post;
                });
            });
            alert("좋아요 처리에 실패했습니다.");
        }
    };

    // 팔로우 토글 함수
    const toggleFollow = async (targetUserId) => {
        if (targetUserId === loginUserId) return;
        const isCurrentlyFollowing = followings.includes(targetUserId);
        if (isCurrentlyFollowing) {
            setFollowings(prev => prev.filter(id => id !== targetUserId));
        } else {
            setFollowings(prev => [...prev, targetUserId]);
        }
        try {
            if (isCurrentlyFollowing) {
                await apiService.deleteFollowing(targetUserId);
            } else {
                await apiService.createFollowing(targetUserId);
            }
        } catch (error) {
            if (isCurrentlyFollowing) {
                setFollowings(prev => [...prev, targetUserId]);
            } else {
                setFollowings(prev => prev.filter(id => id !== targetUserId));
            }
            alert("팔로우 처리에 실패했습니다.");
        }
    };

    const deletePost = async (postId) => {
        try {
            await apiService.deletePost(postId);
            setPosts(posts.filter(p => p.postId !== postId));
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
                <div className="stories-container">
                    <div className="stories-wrapper">
                        <div className="story-item"
                             onClick={() =>
                                 navigate(`/story/upload`)}>
                            <div className="story-avatar-wrapper">
                                <img src={getImageUrl(loginUser.userAvatar)}
                                     className="story-avatar"/>
                            </div>
                            <span className="story-username">
                                {loginUser.userName}
                            </span>
                        </div>
                        {stories.length > 0 &&
                            stories.map((story) => (
                                <div
                                    key={story.userId}  // key는 최상위 요소에만
                                    className="story-item"
                                    onClick={() => navigate(`/story/detail/${story.userId}`)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="story-avatar-wrapper">
                                        <img
                                            src={getImageUrl(story.userAvatar)}
                                            className="story-avatar"
                                            alt={story.userName}
                                        />
                                    </div>
                                    <span className="story-username">{story.userName}</span>
                                </div>
                            ))}
                    </div>
                </div>


                {posts.length > 0 &&
                    posts.map((post) => {
                        const isOwnPost = post.userId === loginUserId;
                        const isFollowing = followings.includes(post.userId);
                        const isLike = likes.includes(post.postId);

                        return (
                            <article key={post.postId} className="post-card">
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
                                    <div className="post-header-right">
                                        {/* 본인 포스트가 아니면 팔로우 버튼 표시 */}
                                        {!isOwnPost && (
                                            <button className={`profile-edit-btn ${isFollowing ? 'following' : 'follow'}`}
                                                    onClick={() => toggleFollow(post.userId)}
                                            >
                                                {isFollowing ? '팔로잉' : '팔로우'}
                                            </button>
                                        )}
                                    </div>
                                    <PostOptionMenu
                                        post={post}
                                        currentUserId={loginUserId}
                                        onDelete={deletePost}/>
                                </div>

                                <img src={getImageUrl(post.postImage)}
                                     className="post-image"
                                    // onClick={() => setSelectedPost(post)}
                                     onClick={() => navigate(`/post/${post.postId}`)}
                                     style={{cursor: 'pointer'}}/>
                                <div className="post-content">
                                    <div className="post-actions">
                                        <div className="post-actions-left">
                                            <Heart
                                                className={`action-icon like-icon ${isLike ? 'liked' : ''}`}
                                                onClick={() => toggleLike(post.postId)}
                                                fill={isLike ? "#ed4956" : "none"}
                                            />
                                            <MessageCircle className="action-icon"
                                                           onClick={() =>
                                                               navigate(`/post/${post.postId}`)}/>
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
                                        <MentionText text={post.postCaption}/>
                                        {/*{post.postCaption}*/}
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
                        );
                    })}
            </div>
            {/*{selectedPost && (*/}
            {/*    <PostDetailModal*/}
            {/*        post={selectedPost}*/}
            {/*        currentUserId={loginUserId}*/}
            {/*        onClose={() => setSelectedPost(null)}*/}
            {/*        onDelete={deletePost}*/}
            {/*        onToggleLike={toggleLike}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
};

export default FeedPage;