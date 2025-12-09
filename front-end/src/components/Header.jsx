import React from "react";
import {ArrowLeft, Film, Home, MessageCircle, PlusSquare, User} from "lucide-react";
import {useNavigate} from "react-router-dom";
import apiService from "../service/apiService";


const Header = ({
    type = "feed",
    title = '',
    onSubmit = null,
    submitDisabled = false,
    submitText = '공유',
    loading = false
                }) => {
    const navigate = useNavigate()
    const handleLogout = () => {
        if (window.confirm("정말 로그아웃 하시겠습니까?")) {
            try {
                apiService.logout();
                navigate('/login');
            } catch (error) {
                console.error("로그아웃 실패:", error);
                alert("로그아웃 처리에 실패했습니다.");
            }
        }
    };

    if(type ==='feed') {
        return (
            <header className="header">
                <div className="header-container">
                    <h1 className="header-title">Instagram</h1>
                    <div className="header-nav">
                        <Home className="header-icon"
                              onClick={() => navigate(('/'))}/>
                        <MessageCircle className="header-icon"/>
                        <PlusSquare className="header-icon"
                                    onClick={() => navigate(('/upload'))}/>
                        <Film className="header-icon"
                              onClick={() => navigate('/story/upload')}/>
                        <User className="header-icon"
                              onClick={() => navigate('/myfeed')}/>
                    </div>
                </div>
            </header>
        )
    }

    if(type === 'upload') {
        return (
            <header className="upload-header">
                <div className="upload-header-content">
                    <button className="upload-back-btn"
                            onClick={() => navigate(("/feed"))}>
                        <ArrowLeft size={24}/>
                    </button>

                    <h2 className="upload-title">새 게시물</h2>

                    <button className="upload-submit-btn"
                            onClick={onSubmit}
                            disabled={loading}
                            style={{
                                opacity: (submitDisabled || loading) ? 0.5 : 1
                            }}>
                        {loading ? '업로드 중...' : submitText}
                    </button>
                </div>
            </header>
        )
    }

    if(type === 'upload') {
        return (
            <header className="upload-header">
                <div className="upload-header-content">
                    <button
                        className="upload-back-btn"
                        onClick={() => navigate("/feed")}
                    >
                        <ArrowLeft size={24}/>
                    </button>

                    <h2 className="upload-title">{title}</h2>

                    <button
                        className="upload-submit-btn"
                        onClick={onSubmit}
                        disabled={submitDisabled || loading}
                        style={{opacity: (submitDisabled || loading) ? 0.5 : 1}}
                    >

                        {loading ? '업로드 중' : submitText}
                    </button>
                </div>
            </header>
        )
    }
};

export default Header;