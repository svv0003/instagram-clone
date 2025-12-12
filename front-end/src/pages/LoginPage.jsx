// ============================================
// src/pages/LoginPage.jsx
// TODO: 로그인 페이지 UI 및 기능 구현
// - username, password state 선언
// - loading state 선언
// - handleLogin 함수: apiService.login 호출
// - 로그인 성공 시 token과 user를 localStorage에 저장
// - 로그인 성공 시 /feed로 이동
// - Enter 키 입력 시 로그인 처리
// ============================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        try {
            const res = await apiService.login(userEmail, password);
            alert("로그인되었습니다.");
            navigate("/feed");
        } catch (error) {
            if(error.response?.status === 401) {
                alert("이메일 또는 비밀번호가 올바르지 않습니다.");
            } else {
                alert("로그인에 실패했습니다. 다시 로그인해주세요.");
            }
        } finally {
            setLoading(false);
        }
    };

    // TODO: Enter 키 입력 시 handleLogin 호출하는 함수 작성
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const handleKakaoLogin = () => {
        /*
        .env 파일에 작성된 변수명을 사용하기 위해서는 맨 앞에 process.env. 작성해야 한다.
        실행중인 애플리케이션의 환경설정의 변수명이라는 뜻이다.
         */
        const API_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;
        const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URL;
        console.log("API_KEY : ", API_KEY);
        console.log("REDIRECT_URI : ", REDIRECT_URI);
        if(!API_KEY || !REDIRECT_URI) {
            alert("카카오 설정 오류 : 환경변수를 확인해주세요.");
            return;
        }
        /*
        카카오톡에서 인증 관련하여 제공하는 URL이다.
        카카오톡에서 client_id로 존재하는 회원인지 확인하고,
        모두 동의했는지 확인 후 다시 프론트엔드로 URI 돌려보낸다.
         */
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-card">
                    <h1 className="login-title">Instagram</h1>
                    <div>
                        {/* TODO: 아이디 입력 input 작성 */}
                        {/* placeholder: "전화번호, 사용자 이름 또는 이메일" */}
                        {/* value: username */}
                        {/* onChange: setUsername */}
                        {/* onKeyPress: handleKeyPress */}
                        <input className="login-input"
                               type="text"
                               placeholder="전화번호, 사용자 이름 또는 이메일"
                               value={userEmail}
                               onChange={(e) => setUserEmail(e.target.value)}
                               onKeyPress={handleKeyPress}
                               autoComplete="email"
                        />

                        {/* TODO: 비밀번호 입력 input 작성 */}
                        {/* type: "password" */}
                        {/* placeholder: "비밀번호" */}
                        {/* value: password */}
                        {/* onChange: setPassword */}
                        {/* onKeyPress: handleKeyPress */}
                        <input className="login-input"
                               type="password"
                               placeholder="비밀번호"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}
                               onKeyPress={handleKeyPress}
                               autoComplete="email"
                        />

                        {/* TODO: 로그인 버튼 작성 */}
                        {/* onClick: handleLogin */}
                        {/* disabled: loading */}
                        {/* 버튼 텍스트: loading이면 "로그인 중...", 아니면 "로그인" */}
                        <button className="login-button"
                                onClick={handleLogin}
                                disabled={loading}>
                            {loading ? "로그인 중..." : "로그인"}
                        </button>
                    </div>
                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">또는</span>
                        <div className="divider-line"></div>
                    </div>
                    <button className="facebook-login">
                        SNS 로그인
                    </button>
                    <img src="/static/img/kakao_login_large_wide.png"
                         onClick={handleKakaoLogin}
                         style={{cursor: "point"}}/>
                    <button className="forgot-password">
                        비밀번호를 잊으셨나요?
                    </button>
                </div>
                {
                    /*
                    익명 함수란 명칭을 작성하지 않고, 1회성으로 사용하는 기능이다.
                    명칭 함수란 기능에 명칭을 부여하여 다양한 태그에서 재사용하는 기능이다.
                    onClick={}은 클릭 시 특정 기능을 동작하며, 동작할 기능 명칭을 작성해야 하지만
                    단순히 사용할 경우에는 익명함수로 작성한다.
                    onClick={function movePage()}
                    onClick={() => navigate("/signup")
                     */
                }
                <div className="signup-box">
                    <p>
                        계정이 없으신가요?
                        <button className="signup-link"
                                onClick={() => navigate("/signup")}
                        >
                            가입하기
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;