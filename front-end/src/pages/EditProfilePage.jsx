import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { getImageUrl } from '../service/commonService';
import Header from '../components/Header';
import '../App.css';
import {Image} from "lucide-react";

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        userFullname: '',
        userEmail: ''
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);
    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    const loginUserId = loginUser.userId;

    useEffect(() => {
        if(!loginUser) return navigate('/login');
        loadUserData();
    }, [navigate]);

    const loadUserData = async () => {
        try {
            console.log("loginUserId : ", loginUserId);
            console.log("loginUserId type : ", typeof(loginUserId));
            const res = await apiService.getUser(loginUserId);
            console.log('res : ', res);
            setUser({
                loginUserName: res.userName,
                loginUserFullname: res.userFullname,
                loginUserEmail: res.userEmail
            });
            setFormData({userEmail: res.userEmail});
            setPreviewImage(res.userAvatar);
            console.log('user : ', user)
        } catch (err) {
            console.error('사용자 정보 로드 실패', err);
        }
    };

    // TODO 3-7: handleImageChange 함수 작성
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewImage(URL.createObjectURL(selectedFile));
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(
            prev => (
                { ...prev, [name]: value }
            )
        );
    };

    // TODO 3-9: handleSubmit 함수 작성
    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const submitData = new FormData();
            const {imgUrl, ...changeData} = formData;
            const updateBlob = new Blob([JSON.stringify(changeData)],
                { type: 'application/json' }
            );
            submitData.append('formData', updateBlob);
            if (file) {
                submitData.append('profileImage', file)
            }
            await apiService.updateProfile(loginUserId, submitData);
            localStorage.getItem('user');
            alert('프로필이 저장되었습니다.');
            navigate('/myfeed');
        } catch (err) {
            console.error(err);
            alert('프로필 저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="feed-container">
            <Header />

            <div className="edit-profile-wrapper">
                <div className="edit-profile-card">
                    <div className="edit-profile-sidebar">
                        <div className="sidebar-item active">프로필 편집</div>
                        <div className="sidebar-item">비밀번호 변경</div>
                        <div className="sidebar-item">앱 및 웹사이트</div>
                    </div>

                    <div className="edit-profile-form">
                        <div className="form-group photo-section">
                            <div className="photo-label-area">
                                <img src={previewImage}
                                     alt="프로필 미리보기" />
                            </div>
                            <div className="photo-input-area">
                                <label htmlFor="profile-upload"
                                       className="photo-change-btn">
                                    프로필 사진 바꾸기
                                </label>
                                <input
                                    id="profile-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{display: 'none'}}
                                />
                            </div>
                        </div>

                        {/* TODO 3-12: 이름 입력 필드 */}
                        <div className="form-group">
                            <label> 이름
                                <input className="edit-input"
                                       type="text"
                                       name="userFullname"
                                       placeholder={user.loginUserFullname}
                                       value={formData.userFullname}
                                       onChange={handleChange}
                                />
                            </label>
                        </div>

                        {/* TODO 3-13: 사용자 이름 입력 필드 */}
                        <div className="form-group">
                            <label> 사용자 이름
                                <input className="edit-input"
                                       type="text"
                                       name="userName"
                                       placeholder={user.loginUserName}
                                       value={formData.userName}
                                       onChange={handleChange}
                                />
                            </label>
                        </div>

                        {/* TODO 3-14: 이메일 입력 필드 */}
                        <div className="form-group">
                            <label> 이메일
                                <input className="edit-input"
                                       type="text"
                                       name="userEmail"
                                       placeholder={user.loginUserEmail}
                                       disabled={true}
                                />
                            </label>
                        </div>

                        {/* TODO 3-15: 제출 버튼 */}
                        <div className="form-group">
                            <label className="form-label"></label>
                            <div className="form-input-wrapper">
                                <button className="edit-submit-btn"
                                        onClick={handleSubmit}
                                        disabled={loading}>
                                    {loading ? '저장 중' : '수정'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
