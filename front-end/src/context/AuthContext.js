import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";
import {API_URLS} from "../service/apiService";

/**
 * context 생성
 */
const AuthContext  = createContext();

/**
 * customHook : 다른 컴포넌트에서 쉽게 사용하기 위한 인증 훅 생성
 * @returns {unknown}
 */
export const useAuth = () => {
    return useContext(AuthContext);
}

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * 페이지 로드 시 로그인 상태 확인
     */
    useEffect(() => {
        checkLoginStatus();
    }, []);

    /**
     * 로그인 상태 확인 및 회원 정보 저장하기
     */
    const checkLoginStatus = () => {
        axios.get(API_URLS.AUTH+"/check", {
            withCredentials:true })
            .then(res => {
                console.log("로그인 상태 확인 응답 : ", res.data);
                setUser(res.data.user);
            })
            .catch(err => {
                console.log("로그인 상태 확인 오류 : ",err);
                setUser(null);
            })
            .finally(() => setLoading(false))
    }

    // const loginFn = (memberEmail, memberPassword) => {
    //     return  axios.post(API_AUTH_URL+'/login',
    //         {memberEmail,memberPassword},
    //         {withCredentials:true})
    //         .then(
    //             res => {
    //                 console.log("res.data      : " + res.data);
    //                 console.log("res.data.user : " + res.data.user);
    //                 // 2. 요청성공(200 ~ 299)
    //                 // 서버가 응답을 성공적으로 보냈을 때 실행
    //                 //setUser(res.data); //로그인 성공 시 사용자에 대한 모든 정보 저장
    //
    //                 if(res.data.success && res.data.user) {
    //                     setUser(res.data.user);
    //                     return{
    //                         success : true,
    //                         message : res.data.message
    //                     };
    //                 } else {
    //                     return {
    //                         success: false,
    //                         message: res.data.message || '로그인 실패'
    //                     }
    //                 }
    //
    //             })
    //         .catch( err => {
    //             console.error("로그인 에러 : ", err);
    //             return {
    //                 success : false,
    //                 message : '로그인 중 오류가 발생했습니다.'
    //             };
    //         });
    // };

    // const logoutFn = () => {
    //     return axios.post(API_AUTH_URL+'/logout',
    //         {},{withCredentials:true})
    //         .then(res => {
    //             console.log("로그아웃 응답 : ", res.data);
    //             setUser(null); // 사용자 정보 초기화
    //             return { success : true };
    //         })
    //         .catch(err => {
    //             console.error("로그아웃 에러 : ", err);
    //             return {success: false};
    //         });
    // }

    const updateUser = (userData) => {
        setUser(userData);
    }

    /**
     * Context에 제공하여 공유할 값
     * @type {{user: unknown, updateUser: updateUser, isAuthenticated: boolean}}
     */
    const value = {
        user,                        // 현재 로그인한 사용자 정보
        updateUser,                 // 업데이트된 유저 정보 반영
        isAuthenticated:!!user     // 로그인 여부(true / false) 제공될 것
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}
export  default  AuthProvider;