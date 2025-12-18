import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import apiService from "../service/apiService";
import {getImageUrl} from "../service/commonService";
import PostOptionMenu from "../components/PostOptionMenu";

const FollowListPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // const { userId, ingEr } = useParams();
    const { userId: paramUserId, ingEr: paramIngEr } = useParams();

    const [loading, setLoading] = useState(true);
    const [followings, setFollowings] = useState([]);
    const [followers, setFollowers] = useState([]);

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
            if(isMyFeed) {
                if(paramIngEr === "following") {
                    const followingsRes = await apiService.getFollowingUserList(loginUserId);
                    setFollowers([]);
                    setFollowings(followingsRes);
                } else {
                    const followersRes = await apiService.getFollowerUserList(loginUserId);
                    setFollowers(followersRes);
                    setFollowings([]);
                }
            } else {
                if(paramIngEr === "following") {
                    const followingsRes = await apiService.getFollowingUserList(paramUserId);
                    setFollowers([]);
                    setFollowings(followingsRes);
                } else {
                    const followersRes = await apiService.getFollowerUserList(paramUserId);
                    setFollowers(followersRes);
                    setFollowings([]);
                }
            }
        } catch (error) {
            console.log(error);
            alert("팔로우 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }
    //
    // const toggleFollow = async (targetUserId) => {
    //     const isCurrentlyFollowing = followings.includes(targetUserId);
    //     if (isCurrentlyFollowing) {
    //         setFollowings(prev => prev.filter(id => id !== targetUserId));
    //     } else {
    //         setFollowings(prev => [...prev, targetUserId]);
    //     }
    //     try {
    //         if (isCurrentlyFollowing) {
    //             await apiService.deleteFollowing(targetUserId);
    //         } else {
    //             await apiService.createFollowing(targetUserId);
    //         }
    //     } catch (error) {
    //         if (isCurrentlyFollowing) {
    //             setFollowings(prev => [...prev, targetUserId]);
    //         } else {
    //             setFollowings(prev => prev.filter(id => id !== targetUserId));
    //         }
    //         alert("팔로우 처리에 실패했습니다.");
    //     }
    // };
    //
    // return (
    //     <>
    //         {followings.length > 0 &&
    //             followings.map((post) => {
    //                 const isFollowing = followings.includes(post.userId);
    //                 return (
    //                     <>
    //                         <img src={getImageUrl(post.userAvatar)}
    //                              className="post-user-avatar"
    //                              onClick={() =>
    //                                  navigate(`/myfeed?userId=${post.userId}`)}
    //                              style={{cursor: 'pointer'}}/>
    //                         <span className="post-username"
    //                               onClick={() =>
    //                                   navigate(`/myfeed?userId=${post.userId}`)}
    //                               style={{cursor: 'pointer'}}>
    //                             {post.userName}
    //                         </span>
    //                         <button className={`profile-edit-btn ${isFollowing ? 'following' : 'follow'}`}
    //                                 onClick={() => toggleFollow(post.userId)}>
    //                             {isFollowing ? '팔로잉' : '팔로우'}
    //                         </button>
    //                     </>
    //                 )
    //             })
    //         }
    //         {followers.length > 0 &&
    //             followers.map((post) => {
    //                 const isFollowing = followers.includes(post.userId);
    //                 return (
    //                     <>
    //                         <img src={getImageUrl(post.userAvatar)}
    //                              className="post-user-avatar"
    //                              onClick={() =>
    //                                  navigate(`/myfeed?userId=${post.userId}`)}
    //                              style={{cursor: 'pointer'}}/>
    //                         <span className="post-username"
    //                               onClick={() =>
    //                                   navigate(`/myfeed?userId=${post.userId}`)}
    //                               style={{cursor: 'pointer'}}>
    //                             {post.userName}
    //                         </span>
    //                         <button className={`profile-edit-btn ${isFollowing ? 'following' : 'follow'}`}
    //                                 onClick={() => toggleFollow(post.userId)}>
    //                             {isFollowing ? '팔로잉' : '팔로우'}
    //                         </button>
    //                     </>
    //                 )
    //             })
    //         }
    //     </>
    // );
};

export default FollowListPage;