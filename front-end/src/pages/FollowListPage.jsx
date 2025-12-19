import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import apiService from "../service/apiService";
import {getImageUrl} from "../service/commonService";
import PostOptionMenu from "../components/PostOptionMenu";
import Header from "../components/Header";

const FollowListPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // const { userId, ingEr } = useParams();
    const { userId: paramUserId, ingEr: paramIngEr } = useParams();

    const [loading, setLoading] = useState(true);
    const [followingUserIdList, setFollowingUserIdList] = useState([]);
    const [followUserList, setFollowUserList] = useState([]);

    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    const loginUserId = loginUser.userId;

    const isMyFeed = paramUserId === loginUserId;
    const isMyFeedWithUserId = location.pathname === '/myfeed' && location.search.startsWith('?userId=');


    useEffect(() => {
        getFollowData();
    }, [navigate]);

    const getFollowData = async () => {
        setLoading(true);
        try {
            const followingUserIdRes = await apiService.getFollowingList();
            setFollowingUserIdList(followingUserIdRes);
            if(isMyFeed) {
                if(paramIngEr === "following") {
                    const followingsRes = await apiService.getFollowingUserList(loginUserId);
                    setFollowUserList(followingsRes);
                } else {
                    const followersRes = await apiService.getFollowerUserList(loginUserId);
                    setFollowUserList(followersRes);
                }
            } else {
                if(paramIngEr === "following") {
                    const followingsRes = await apiService.getFollowingUserList(paramUserId);
                    setFollowUserList(followingsRes);
                } else {
                    const followersRes = await apiService.getFollowerUserList(paramUserId);
                    setFollowUserList(followersRes);
                }
            }
        } catch (error) {
            console.log(error);
            alert("팔로우 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    const toggleFollow = async (targetUserId) => {
        if (targetUserId === loginUserId) return;
        const isFollowing = followingUserIdList.includes(targetUserId);
        if (isFollowing) {
            setFollowingUserIdList(prev => prev.filter(id => id !== targetUserId));
        } else {
            setFollowingUserIdList(prev => [...prev, targetUserId]);
        }
        try {
            if (isFollowing) {
                await apiService.deleteFollowing(targetUserId);
            } else {
                await apiService.createFollowing(targetUserId);
            }
        } catch (error) {
            if (isFollowing) {
                setFollowingUserIdList(prev => [...prev, targetUserId]);
            } else {
                setFollowingUserIdList(prev => prev.filter(id => id !== targetUserId));
            }
            alert("팔로우 처리에 실패했습니다.");
        }
    };

    return (
        <>
            <Header />
            <h2 className="follow-list-title">
                {paramIngEr === "following" ? "팔로잉" : "팔로워"}
            </h2>
            {followUserList.length > 0 ? (
                followUserList.map((user) => {
                    const isFollowing = followingUserIdList.includes(user.userId);
                    return (
                        <>
                            <li key={user.userId} className="follow-user-list">
                                <div className="follow-user-info"
                                     onClick={() =>
                                         navigate(`/myfeed?userId=${user.userId}`)}>
                                    <img className="follow-user-avatar"
                                         src={getImageUrl(user.userAvatar)}
                                         alt={user.userName} />
                                    <div className="follow-user-text">
                                        <span className="follow-user-name">{user.userName}</span>
                                        <span className="follow-user-fullname">{user.userFullname}</span>
                                    </div>
                                </div>
                                {user.userId !== loginUserId && (
                                    <button className={`follow-btn ${isFollowing ? 'following' : ''}`}
                                            onClick={() => toggleFollow(user.userId)}
                                    >
                                        {isFollowing ? '팔로잉' : '팔로우'}
                                    </button>
                                )}
                            </li>
                        </>
                    )
                })
            ) : (
                <p className="no-data">표시할 유저가 없습니다.</p>
            )}
        </>
    );
};

export default FollowListPage;