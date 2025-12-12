import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";
import axios from "axios";

const KakaoCallback = () => {
    const navigate = useNavigate();
    const isProcessing = useRef(false);

    useEffect(() => {
        if (isProcessing.current) {
            console.log("이미 처리 중입니다. 중복 실행 방지");
            return;
        }
        isProcessing.current = true;
        const params = new URL(document.location.toString()).searchParams;
        const code = params.get("code");
        const error = params.get("error");
        console.log("=== 카카오 콜백 시작 ===");
        console.log("전체 URL:", document.location.toString());
        console.log("code:", code);
        console.log("error:", error);
        if (error) {
            console.error("카카오 인증 에러:", error);
            alert(`카카오 인증 실패: ${error}`);
            isProcessing.current = false;
            navigate("/login");
            return;
        }
        if (code) {
            console.log("code 값이 있음, 로그인 프로세스 시작");
            kakaoLoginProcess(code);
        } else {
            console.error("code 값이 없음");
            alert("잘못된 접근입니다.");
            isProcessing.current = false;
            navigate("/login");
        }
    }, []);

    const kakaoLoginProcess = async (code) => {
        console.log("=== 카카오 로그인 프로세스 시작 ===");
        console.log("전송할 code:", code);
        try {
            console.log("백엔드 API 호출 시작...");
            const res = await axios.post("/api/auth/kakao", {code});
            console.log("API 응답 성공!");
            console.log("응답 상태:", res.status);
            console.log("응답 데이터:", res.data);
            if (res.status === 200) {
                const {token, user} = res.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                console.log("로그인 성공, /feed로 이동");
                alert(`환영합니다. ${user.userName}님`);
                navigate("/feed");
            } else if (res.status === 202) {
                const kakaoUser = res.data.kakaoUser;
                console.log("미가입 회원, 회원가입 페이지로 이동");
                console.log("카카오 유저 정보:", kakaoUser);
                setTimeout(() => {
                    alert("가입되지 않은 회원입니다. 회원가입을 진행해주세요.");
                    navigate("/signup", {
                        state: {
                            email: kakaoUser.userEmail,
                            name: kakaoUser.userName,
                            nickname: kakaoUser.userFullname
                        }
                    });
                }, 100);
            }
        } catch (err) {
            console.error("=== 카카오 로그인 에러 ===");
            console.error("에러 객체:", err);
            console.error("에러 메시지:", err.message);
            console.error("에러 응답:", err.response);
            console.error("에러 응답 데이터:", err.response?.data);
            console.error("에러 상태 코드:", err.response?.status);
            if (err.response?.status === 400 && err.response?.data === "카카오 토큰 발급 실패") {
                console.log("중복 실행으로 인한 에러, 무시합니다.");
                return;
            }
            let errorMessage = "카카오 로그인 중 오류가 발생했습니다.";
            if (err.response?.data) {
                errorMessage = `${errorMessage}\n상세: ${err.response.data}`;
            }
            alert(errorMessage);
            isProcessing.current = false;
            navigate("/login");
        }
    };

    return(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh'
        }}>
            <h2>카카오 로그인 처리중입니다.</h2>
            <p>잠시만 기다려주세요.</p>
            <div style={{marginTop: '20px', fontSize: '12px', color: '#666'}}>
                로그인 처리 중... 콘솔 로그를 확인하세요.
            </div>
        </div>
    )
}

export default KakaoCallback;