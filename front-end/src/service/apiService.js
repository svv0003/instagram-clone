import axios from 'axios';

const API_BASE_URL = '/api';
// export const API_BASE_URL = 'http://localhost:9000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

/*
모든 요청에 JWT 토큰 추가
사용자의 요청을 가로채다 = interceptor
 */
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// 401 에러가 발생하면 localStorage를 비우고 /login으로 이동
/*
401 : 인증 안됨 : 로그인을 안했거나, 토큰 만료
    -> 로그인 페이지로 이동(토큰 만료, 토큰이 임의로 삭제, 잘못된 토큰 = 누군가가 토큰을 임의로 조작)
403 : 권한 없음 : 로그인은   했지만, 접근할 권한 부족 - 사업자
    -> 권한 없습니다 알림 이전 페이지로 돌려보내거나 메인 페이지로 돌려보내기
404 :      없음 : 게시물 / 사용자 / 페이지 없음
    -> 찾을 수 없습니다 알림 이전 페이지로 돌려보내거나 메인 페이지로 돌려보내기
500 : 서버 에러 : 서버 문제
    -> 고객센터 연락 방법 띄우기
 */
api.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if(error.response && error.response.status === 401){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

// 기능 2번과 같은 형태로 함수 활용
const apiService = {
    // ===== 인증 API =====
    // POST /auth/signup
    // body: { username, email, password, fullName }
    signup: async (username, email, password, fullName) => {
        const response = await api.post('/auth/signup', {
            userName: username,
            userEmail: email,
            userPassword: password,
            userFullname: fullName,
        });
        return response.data;
    },

    // POST /auth/login
    // body: { userEmail, password }
    login: async (userEmail, password) => {
        const res = await api.post('/auth/login', {
            userEmail: userEmail,
            userPassword: password,
        });

        // 토큰과 사용자 정보를 localStorage 저장
        if(res.data.token) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
        }
        return res.data;
    },

    // TODO: 로그아웃 함수
    // localStorage에서 token과 user 제거하고 /login으로 이동
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = '/login';
    },

    // ===== 게시물 API =====
    /**
     * 모든 게시물 조회
     */
    getPosts: async () => {
        try {
            const res = await api.get('/posts');
            return res.data;
        } catch (error) {
            alert("데이터를 가져올 수  없습니다.");
        }
    },

    /**
     * 특정 게시물 조회
     * */
    getPost: async (postId) => {
        try {
            const res = await api.get('/posts/' + postId);
            return res.data;
        } catch (error) {
            alert("데이터를 가져올 수  없습니다.");
        }
    },

    /**
     * 게시물 작성
     */
    createPost: async (postImage, postCaption, postLocation) => {
        try {
            const uploadPost = new FormData();
            uploadPost.append("postImage", postImage);
            uploadPost.append("postCaption", postCaption);
            uploadPost.append("postLocation", postLocation);
            const res = await  api.post("/posts", uploadPost, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return res.data;
        } catch (e) {
            alert("게시물 작성 실패 : {}", e);
        }
    },

    // TODO: 게시물 삭제
    // DELETE /posts/:postId
    deletePost: async (postId) => {
    },


    /*================================================================================
                                        좋아요 API
    ================================================================================*/

    // TODO: 좋아요 추가
    // POST /posts/:postId/like
    // addLike: async (postId) => {
    //     try {
    //         const res = await api.post(`/posts/${postId}/like`, postId);
    //         return res.data;
    //     } catch (e) {
    //         alert("좋아요 실패 : {}", e);
    //     }
    // },

    // TODO: 좋아요 취소
    // DELETE /posts/:postId/like
    // removeLike: async (postId) => {
    //     try {
    //         const res = await api.delete(`/posts/${postId}/like`, postId);
    //         return res.data;
    //     } catch (e) {
    //         alert("좋아요 취소 실패 : {}", e);
    //     }
    // },

    /**
     * 좋아요 목록 조회
     * @returns {Promise<any>}
     */
    getLikeList: async () => {
        try {
            const res = await api.get("/like/list");
            return res.data;
        } catch (e) {
            alert("좋아요 목록 조회 실패 : {}", e);
        }
    },

    /**
     * 좋아요 유무 확인
     * @returns {Promise<any>}
     */
    getLike: async (postId) => {
        try {
            const res = await api.get(`/like/check?postId=${postId}`);
            return res.data;
        } catch (e) {
            alert("좋아요 유무 확인 실패 : {}", e);
        }
    },

    /**
     * 좋아요 수 조회
     * @param postId
     * @returns {Promise<any>}
     */
    getLikes: async (postId) => {
        try {
            const res = await api.get(`/like/count?postId=${postId}`);
            return res.data;
        } catch (e) {
            alert("좋아요 수 조회 실패 : {}", e);
        }
    },

    /**
     * 좋아요 추가
     * @param postId
     * @returns {Promise<any>}
     */
    createLike: async (postId) => {
        try {
            const res = await api.post(`/like/add?postId=${postId}`);
            return res.data;
        } catch (e) {
            alert("좋아요 선택 실패 : {}", e);
        }
    },

    /**
     * 좋아요 취소
     * @param postId
     * @returns {Promise<any>}
     */
    deleteLike: async (postId) => {
        try {
            const res = await api.delete(`/like/delete?postId=${postId}`);
            return res.data;
        } catch (e) {
            alert("좋아요 취소 실패 : {}", e);
        }
    },

    /*================================================================================
                                        팔로우 API
    ================================================================================*/

    /**
     * 팔로잉 목록 조회
     * @returns {Promise<any>}
     */
    getFollowingList: async () => {
        try {
            const res = await api.get(`/follow/list/following/userId`);
            return res.data;
        } catch (e) {
            alert("팔로잉 목록 조회 실패 : {}", e);
        }
    },
    /**
     * 팔로잉 목록 조회
     * @returns {Promise<any>}
     */
    getFollowingUserList: async (userId) => {
        try {
            const res = await api.get(`/follow/list/following?userId=${userId}`);
            return res.data;
        } catch (e) {
            alert("팔로잉 유저 목록 조회 실패 : {}", e);
        }
    },

    /**
     * 팔로워 목록 조회
     * @returns {Promise<any>}
     */
    getFollowerUserList: async (userId) => {
        try {
            const res = await api.get(`/follow/list/follower?userId=${userId}`);
            return res.data;
        } catch (e) {
            alert("팔로워 유저 목록 조회 실패 : {}", e);
        }
    },

    /**
     * 팔로우 유무 확인
     * @returns {Promise<any>}
     */
    getFollowing: async (userId) => {
        try {
            const res = await api.get(`/follow/check?userId=${userId}`);
            return res.data;
        } catch (e) {
            alert("팔로잉 유무 확인 실패 : {}", e);
        }
    },

    /**
     * 팔로우/팔로잉 수 조회
     * @param userId
     * @returns {Promise<any>}
     */
    getFollowingCount: async (userId) => {
        try {
            const res = await api.get(`/follow/count?userId=${userId}`);
            return res.data;
        } catch (e) {
            alert("팔로잉/팔로우 조회 실패 : {}", e);
        }
    },

    /**
     * 팔로우 신청
     * @param userId
     * @returns {Promise<any>}
     */
    createFollowing: async (userId) => {
        try {
            const res = await api.post(`/follow/add?userId=${userId}`);
            return res.data;
        } catch (e) {
            alert("팔로우 선택 실패 : {}", e);
        }
    },

    /**
     * 팔로우 취소
     * @param userId
     * @returns {Promise<any>}
     */
    deleteFollowing: async (userId) => {
        try {
            const res = await api.delete(`/follow/delete?userId=${userId}`);
            return res.data;
        } catch (e) {
            alert("팔로우 취소 실패 : {}", e);
        }
    },



    /*================================================================================
                                        댓글 API
    ================================================================================*/

    // TODO: 댓글 목록 조회
    // GET /posts/:postId/comments
    getComments: async (postId) => {
        try {
            const res = await api.get(`/posts/${postId}/comments`);
            return res.data;
        } catch (e) {
            alert("댓글 조회 실패 : {}", e);
        }
    },

    // TODO: 댓글 작성
    // POST /posts/:postId/comments
    // body: { commentContent }
    createComment: async (postId, commentContent) => {
        try {
            const res = await api.post(`/posts/${postId}/comments`, {commentContent});
            return res.data;
        } catch (e) {
            alert("댓글 작성 실패 : {}", e);
        }
    },

    // TODO: 댓글 삭제
    // DELETE /comments/:commentId
    deleteComment: async (commentId) => {
        try {
            const res = await api.delete(`/comments/${commentId}`);
            return res.data;
        } catch (e) {
            alert("댓글 삭제 실패 : {}", e);
        }
    },

    // ===== 스토리 API =====

    /**
     * 스토리 목록 조회
     */
    getStories: async () => {
        try {
            const res = await api.get('/stories');
            return res.data;
        } catch (e) {
            alert("스토리 조회 실패 : {}", e);
        }
    },

    /**
     * 특정 스토리 조회
     */
    getStoryByStoryId: async (storyId) => {
        try {
            const res = await api.get(`/stories/${storyId}`);
            return res.data;
        } catch (e) {
            alert("스토리 조회 실패 : {}", e);
        }
    },

    /**
     * 스토리 작성
     */
    createStory: async (storyImage) => {
        const uploadStory = new FormData();
        uploadStory.append("storyImage", storyImage);
        console.log("storyImage", storyImage);
        const res = await api.post(
            "/stories",
            uploadStory,
            {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    },

    /**
     * 스토리 삭제
     */
    // deleteStory: async (userId, storyId) => {
    deleteStory: async (storyId) => {
        // console.log("userId : ", userId);
        console.log("storyId : ", storyId);
        // const res = await api.delete(`/stories/${userId}/${storyId}`);
        const res = await api.delete(`/stories/${storyId}`);
      // return res.data
    },

    // ===== 사용자 API =====
    /**
     * 로그인 회원 프로필 조회
     */
    getLoginUser: async () => {
        try {
            const res = await api.get(`/auth/profile`);
            console.log("res : ", res);
            return res.data;
        } catch (error) {
            alert("데이터를 가져올 수 없습니다.");
        }
    },

    /**
     * 로그인 회원 프로필 업데이트
     */
    updateProfile: async (formData) => {
        console.log("formData : ", formData);
        try {
            const res = await api.put(`/auth/profile/edit`, formData, {
                headers : {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("res : ", res);
            if(res.data) {
                localStorage.setItem('user', JSON.stringify(res.data));
                const token = localStorage.getItem("token");
                if(token) {
                    localStorage.setItem("token", token);
                }
            }
            return res.data;
        } catch (e) {
            alert("회원정보 수정 실패 : {}", e);
        }
    },

    /**
     * 비밀번호 확인
     */
    checkUserPassword: async (password) => {
        console.log("password : ", password);
        try {
            const res = await api.post(`/auth/profile/password`, {password});
            console.log("res : ", res);
            return res;
        } catch (e) {
            alert("비밀번호 조회 실패 : {}", e);
        }
    },

    /**
     * 비밀번호 업데이트
     */
    changeUserPassword: async (newPassword) => {
        console.log("newPassword : ", newPassword);
        try {
            const res = await api.put(`/auth/profile/edit/password`, {newPassword});
            console.log("res : ", res);
            return res;
        } catch (e) {
            alert("비밀번호 수정 실패 : {}", e);
        }
    },

    /**
     * 사용자 프로필 조회
     * GET /users/:userId
     */
    getUser: async (userId) => {
        try {
            const res = await api.get(`/users/profile/${userId}`);
            console.log("res : ", res);
            return res.data;
        } catch (error) {
            alert("데이터를 가져올 수 없습니다.");
        }
    },

    /**
     * 사용자 게시물 조회
     * GET /users/:userId/posts
     */
    getUserPosts: async (userId) => {
        try {
            const res = await api.get(`/posts/user/${userId}`);
            console.log("postRes : ", res);
            return res.data;
        } catch (error) {
            alert("데이터를 가져올 수 없습니다.");
        }
    },

    /**
     * 사용자 스토리 조회
     */
    getUserStories: async (userId) => {
        try {
            console.log("api.get 시작");
            const res = await api.get(`/stories/user/${userId}`);
            console.log("res : ", res);
            return res.data;
        } catch (e) {
            alert("스토리 조회 실패 : {}", e);
        }
    },

    // TODO 1: 유저 검색 API 호출 함수 구현
    // GET /api/users/search?q={query}
    searchUsers: async (query) => {
        // const res = await api.get(`/api/users/search?q=${encodeURIComponent(query) }`);
        try {
            const res = await api.get(`/users/search?q=${query}`);
            return res.data;
        } catch (err) {
            console.error("유저 검색 실패",err);
            return [];
        }
    },

    // TODO 2: 유저네임으로 유저 조회 API 호출 함수 구현
    // GET /api/users/username/{username}
    getUserByUsername: async (username) => {
        try {
            const res = await api.get(`/users/username/${username}`);
            return res.data;
        }catch(err) {
            console.error("유저 조회 실패",err);
            return null;
        }
    },
};

export default apiService;

/*
export const 기능1번 = () => {}
const 기능2번 = {
     회원가입기능 : () => {},
     로그인기능 : () => {}
}

export  default 기능2번;
 */