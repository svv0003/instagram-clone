import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import {Heart, Grid, Bookmark, Settings } from 'lucide-react';
import apiService from "../service/apiService";
import {useLocation, useNavigate} from "react-router-dom";
import {getImageUrl} from "../service/commonService";

const MyFeedPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({
        username: "",
        userFullname: "",
        profileImage: null,
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        bio: "안녕하세요."
    });

    const [posts, setPosts] = useState([]);
    const [saves, setSaves] = useState([]);
    const [likes, setLikes] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);

    const [currentImages, setCurrentImages] = useState({});
    const currentState = activeTab === 'posts'
        ? posts
        : activeTab === 'saves'
            ? saves
            : likes;

    const [followingCount, setFollowingCount] = useState(0);
    const [followerCount, setFollowerCount] = useState(0);
    const [isFollowing, setIsFollowing] = useState(false);

    const [isLoginUser, setIsLoginUser] = useState(false);
    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    const loginUserId = loginUser.userId;

    const searchParams = new URLSearchParams(location.search);
    const paramUserId = searchParams.get('userId');

    const isMyFeed = location.pathname === '/myfeed' && !location.search;
    const isMyFeedWithUserId = location.pathname === '/myfeed' && location.search.startsWith('?userId=');

    const isRealMyFeed = !paramUserId || parseInt(paramUserId) === loginUserId;
    const feedPageOwner = isRealMyFeed ? loginUserId : parseInt(paramUserId);


    useEffect(() => {
        if (!loginUser || !loginUserId) return navigate('/login');
        getMyFeedData();
    }, [navigate, paramUserId, loginUserId]);

    useEffect(() => {
        const loadImages = async () => {
            const newImages = {};
            await Promise.all(
                currentState.map( async (postId) => {
                    if (!currentImages[postId]) {
                        try {
                            const res = await apiService.getPostImage(postId);
                            newImages[postId] = res;
                        } catch (e) {
                            newImages[postId] = null;
                        }
                    }
                })
            );
            setCurrentImages(prev => ({ ...prev, ...newImages }));
        };
        loadImages();
    }, [activeTab, posts, likes, saves]);

    const getMyFeedData = async () => {
        setLoading(true);
        try {
            let userRes;
            if (isRealMyFeed) {
                userRes = await apiService.getLoginUser();
            } else {
                userRes = await apiService.getUser(paramUserId);
            }
            setUser({
                username: userRes.userName,
                userFullname: userRes.userFullname || '',
                profileImage: userRes.userAvatar
            });
            if (!isRealMyFeed && feedPageOwner) {
                const following = await apiService.getFollowing(feedPageOwner);
                setIsFollowing(following);
            }
            const followRes = await apiService.getFollowingCount(feedPageOwner);
            setFollowerCount(followRes.resultFollower || 0);
            setFollowingCount(followRes.resultFollowing || 0);
            const postsRes = await apiService.getUserPosts(feedPageOwner);
            setPosts(postsRes || []);
            const likesRes = await apiService.getUserLikes(feedPageOwner);
            setLikes(likesRes || []);
        } catch (error) {
            console.error(error);
            alert("프로필 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    const toggleFollow = async () => {
        if (isRealMyFeed || !paramUserId) return;
        const previous = isFollowing;
        setIsFollowing(!previous);
        setFollowerCount(prev => previous ? prev - 1 : prev + 1);
        try {
            if (previous) {
                await apiService.deleteFollowing(feedPageOwner);
            } else {
                await apiService.createFollowing(feedPageOwner);
            }
        } catch (error) {
            setIsFollowing(previous);
            setFollowerCount(prev => previous ? prev + 1 : prev - 1);
            alert("팔로우 처리에 실패했습니다.");
        }
    };



    return (
        <div className="feed-container">
            <Header type="feed" />
            <main className="profile-wrapper">
                <header className="profile-header">
                    <div className="profile-image-container">
                        <div className="profile-image-border">
                            <img
                                // src={loginUser.userAvatar != null
                                //     ? loginUser.userAvatar
                                //     : '/static/img/default-avatar.jpg'}
                                src={getImageUrl(user.profileImage)}
                                alt="profile"
                                className="profile-image-large"
                            />
                        </div>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-title-row">
                            <h2 className="profile-username">{user.username}</h2>
                            <div className="profile-actions">
                                {isRealMyFeed ? (
                                    <>
                                        <button className="profile-edit-btn"
                                                onClick={() => navigate('/profile/edit')}>
                                            프로필 편집
                                        </button>
                                        <button className="profile-archive-btn">보관함 보기</button>
                                    </>
                                ) : (
                                    <>
                                        <button className={`profile-edit-btn ${isFollowing ? 'following' : 'follow'}`}
                                                onClick={toggleFollow}
                                        >
                                            {isFollowing ? '팔로잉' : '팔로우'}
                                        </button>
                                        <button className="profile-archive-btn">메시지</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <ul className="profile-stats">
                            <li>게시물 <strong>{posts.length}</strong></li>
                            <li onClick={() =>
                                navigate(`/follow/${feedPageOwner}/follower`)}>
                                팔로워<strong>{followerCount}</strong>
                            </li>
                            <li onClick={() =>
                                navigate(`/follow/${feedPageOwner}/following`)}>
                                팔로잉<strong>{followingCount}</strong></li>
                        </ul>

                        <div className="profile-bio-container">
                            <div className="profile-fullname">{user.userFullname}</div>
                        </div>
                    </div>
                </header>

                <div className="profile-stats-mobile">
                    <div className="stat-item">
                        <span className="stat-value">{posts.length}</span>
                        <span className="stat-label">게시물</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{followerCount}</span>
                        <span className="stat-label">팔로워</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{followingCount}</span>
                        <span className="stat-label">팔로잉</span>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}>
                        <Grid size={12} /> 게시물
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'saves' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saves')}>
                        <Bookmark size={12} /> 저장됨
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'likes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('likes')}>
                        <Heart size={12} /> 좋아요
                    </button>
                </div>


                <div className="profile-posts-grid">
                    {currentState.map((postId) => (
                        <div key={postId}
                             className="grid-item"
                             onClick={() => navigate(`/post/${postId}`)}>
                            {currentImages[postId] ? (
                                <img src={getImageUrl(currentImages[postId])} alt="post" />
                            ) : (
                                <div className="image-placeholder">
                                    <div className="skeleton-box"></div>
                                </div>
                            )}
                            <div className="grid-hover-overlay"></div>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
};

export default MyFeedPage;