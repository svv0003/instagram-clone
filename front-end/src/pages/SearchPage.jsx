import React, {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import Header from '../components/Header';
import { getImageUrl } from '../service/commonService';
import {X} from "lucide-react";

const FeedPage = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    const inputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // const [isSearchOpen, setIsSearchOpen] = useState(false);
    // const openSearch = () => setIsSearchOpen(true);
    // const closeSearch = () => setIsSearchOpen(false);

    const loginUser = JSON.parse(localStorage.getItem("user") || '[]');
    const loginUserId = loginUser.userId;

    useEffect(() => {
        loadFeedData()
    }, []);

    const loadFeedData = async () => {
        setLoading(true);
        try {
            const postRes = await apiService.getAllPosts();
            setPosts(postRes);
        } catch (error) {
            alert("데이터를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSearching) {
            const saved = localStorage.getItem('recentSearches');
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            } else {
                setRecentSearches([]);
            }
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isSearching]);

    useEffect(() => {
        if (!searchQuery || searchQuery.trim() === '') {
            setSearchResults([]);
            setSearchLoading(false);
            return;
        }
        setIsSearching(true);
        setSearchLoading(true);
        const debounceTimer = setTimeout(async () => {
            try {
                const res = await apiService.searchUsers(searchQuery);
                setSearchResults(res || []);
                setLoading(false);
            } catch (err) {
                console.error('검색 실패:', err);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleUserClick = (user) => {
        const recentClick = [
            user,
            ...recentSearches.filter(u => u.userId !== user.userId)
        ].slice(0, 10);
        setRecentSearches(recentClick);
        localStorage.setItem('recentSearches', JSON.stringify(recentClick));
        navigate(`/myfeed?userId=${user.userId}`);
    };

    const removeRecentSearch = (userId, e) => {
        e.stopPropagation();
        const deletedResult = recentSearches.filter(u => u.userId !== userId);
        localStorage.setItem('recentSearches', JSON.stringify(deletedResult));
        setRecentSearches(deletedResult);
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
        <>
            <main className="profile-wrapper">
                <div className="feed-container">
                    <Header/>
                    <div className="follow-search-container">
                        <input ref={inputRef}
                               type="text"
                               placeholder="검색"
                               value={searchQuery}
                               onChange={(e) =>
                                   setSearchQuery(e.target.value)}
                               // onClick={openSearch}
                               onFocus={() => setIsSearching(true)}
                               className="follow-search-input" />
                        <div className="follow-search-reset-btn"
                             onClick={() => {
                                 setSearchQuery("");
                                 setIsSearching(false);}}
                             style={{cursor: 'pointer'}}>
                            취소
                        </div>
                    </div>

                    {!isSearching ? (
                        <div className="profile-posts-grid">
                            {posts.map((post) => {
                                return (
                                    <div key={post.postId}
                                         className="grid-item"
                                         onClick={() =>
                                             navigate(`/post/${post.postId}`)}>
                                        <img src={getImageUrl(post.postImage)}
                                             alt="post" />
                                        <div className="grid-hover-overlay"></div>
                                    </div>
                                )
                            })}
                        </div>
                    ) :
                        // (
                        // <ul className="follow-user-list-wrapper">
                        //     {isSearching ? (
                        //         <div className="search-loading">검색 중...</div>
                        //     ) : (searchResults.length > 0
                        //             ? searchResults
                        //             : recentSearches
                        //     ).map((user) => (
                        //         <li
                        //             key={user.userId}
                        //             className="follow-user-list"
                        //             onClick={() => handleUserClick(user)}
                        //         >
                        //             <div className="follow-user-info">
                        //                 <img
                        //                     className="follow-user-avatar"
                        //                     src={getImageUrl(user.userAvatar)}
                        //                     alt={user.userName}
                        //                 />
                        //                 <div className="follow-user-text">
                        //                 <span className="follow-user-name">
                        //                     {user.userName}
                        //                 </span>
                        //                     <span className="follow-user-fullname">
                        //                     {user.userFullname}
                        //                 </span>
                        //                 </div>
                        //             </div>
                        //
                        //             {user.userId !== loginUserId && (
                        //                 <button className="follow-btn">
                        //                     팔로우
                        //                 </button>
                        //             )}
                        //         </li>
                        //     ))}
                        // </ul>
                        searchQuery.trim() === '' ? (
                            <>
                                {recentSearches.length > 0 && (
                                    <>
                                        <div className="search-section-header">
                                            <span className="search-section-title">최근 검색 항목</span>
                                        </div>
                                        <ul className="follow-user-ul">
                                            {recentSearches.map((user) => {
                                                return (
                                                    <li key={user.userId} className="follow-user-list">
                                                        <div className="follow-user-info"
                                                             onClick={() =>
                                                                 handleUserClick(user)}>
                                                            <img src={getImageUrl(user.userAvatar)}
                                                                 alt={user.userName}
                                                                 className="search-result-avatar"/>
                                                            <div className="search-result-info">
                                                                <div
                                                                    className="search-result-username">{user.userName}</div>
                                                                <div
                                                                    className="search-result-fullname">{user.userFullname}</div>
                                                            </div>
                                                            <X size={16}
                                                               className="search-remove-icon"
                                                               onClick={(e) =>
                                                                   removeRecentSearch(user.userId, e)}/>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </>
                                )}
                                {recentSearches.length === 0 && (
                                    <div className="search-empty">
                                        <p>최근 검색 내역이 없습니다.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {searchLoading ? (
                                    <div className="search-loading">검색 중...</div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        {searchResults.map((user) => (
                                            <div key={user.userId}
                                                 className="search-result-item"
                                                 onClick={() => handleUserClick(user)}>
                                                <img src={getImageUrl(user.userAvatar)}
                                                     alt={user.userName}
                                                     className="search-result-avatar"/>
                                                <div className="search-result-info">
                                                    <div
                                                        className="search-result-username">{user.userName}</div>
                                                    <div
                                                        className="search-result-fullname">{user.userFullname}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div className="search-empty">
                                        <p>검색 결과가 없습니다.</p>
                                    </div>
                                )}
                            </>
                        )
                    }
                </div>
                {/*<SearchModal isOpen={isSearchOpen}*/}
                {/*             onClose={closeSearch} />*/}
            </main>
        </>
    );
};

export default FeedPage;