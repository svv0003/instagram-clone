import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Grid, Bookmark, Settings } from 'lucide-react';
import apiService from "../service/apiService";
import {useNavigate} from "react-router-dom";

const MyFeedPage = () => {
    const [user, setUser] = useState({
        username: "my_instagram",
        userFullname: "내 이름",
        profileImage: null,
        postCount: 12,
        followerCount: 150,
        followingCount: 45,
        bio: "안녕하세요."
    });
    const [posts, setPosts] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    const loginUserId = loginUser.userId;

    useEffect(() => {
        if(!loginUser) return navigate('/login');
        getMyFeedData();
    }, []);

    const getMyFeedData = async () => {
        setLoading(true);
        try {
            console.log("loginUserId : ", loginUserId);
            /*
            전체 게시물 가져와서 본인 게시물 필터링하는 방식
            const allPosts = await apiService.getPosts();
            const myPosts = allPosts.filter(post => post.userId == loginUserId);
             */
            const userRes = await apiService.getUser(loginUserId);
            console.log("userRes : ", userRes);
            setUser({
                username: userRes.userName,
                userFullname: userRes.userFullname,
                profileImage: userRes.userAvatar
            });
            console.log('profileImage : ', userRes.userAvatar);
            const feedRes = await apiService.getUserPosts(loginUserId);
            setPosts(feedRes);
        } catch (error) {
            console.log(error);
            alert("계정 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

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
                                src={user.profileImage}
                                alt="profile"
                                className="profile-image-large"
                            />
                        </div>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-title-row">
                            <h2 className="profile-username">{user.username}</h2>
                            <div className="profile-actions">
                                <button className="profile-edit-btn"
                                        onClick={() => navigate('/profile/edit')}>
                                    프로필 편집
                                </button>
                                <button className="profile-archive-btn">보관함 보기</button>
                            </div>
                        </div>

                        <ul className="profile-stats">
                            <li>게시물 <strong>0</strong></li>
                            <li>팔로워 <strong>0</strong></li>
                            <li>팔로잉 <strong>0</strong></li>
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
                        <span className="stat-value">0</span>
                        <span className="stat-label">팔로워</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">0</span>
                        <span className="stat-label">팔로잉</span>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('posts')}
                    >
                        <Grid size={12} /> 게시물
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
                        onClick={() => setActiveTab('saved')}
                    >
                        <Bookmark size={12} /> 저장됨
                    </button>
                </div>

                <div className="profile-posts-grid">
                    {posts.map((post) => (
                        <div key={post.postId} className="grid-item">
                            <img src={post.postImage} alt="post" />
                            <div className="grid-hover-overlay"></div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default MyFeedPage;