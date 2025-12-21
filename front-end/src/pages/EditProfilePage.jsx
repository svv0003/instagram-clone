import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';
import { getImageUrl } from '../service/commonService';
import Header from '../components/Header';
import '../App.css';

const EditProfilePage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('profile'); // 'profile' | 'password' | 'apps'
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(false); // 비밀번호 확인 후 편집 가능 여부

    const [formData, setFormData] = useState({
        userName: '',
        userFullname: '',
        userEmail: '',
        userAvatar: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [file, setFile] = useState(null);

    const loginUser = JSON.parse(localStorage.getItem('user') || '{}');
    const loginUserId = loginUser.userId;

    useEffect(() => {
        if (!loginUser || !loginUserId) {
            navigate('/login');
            return;
        }
        loadUserData();
    }, [navigate]);

    const loadUserData = async () => {
        try {
            const res = await apiService.getLoginUser(loginUserId);
            setUser(res);
            setFormData({
                userName: res.userName || '',
                userFullname: res.userFullname || '',
                userEmail: res.userEmail || '',
                userAvatar: res.userAvatar || '',
            });
        } catch (err) {
            console.error('사용자 정보 로드 실패', err);
            alert('사용자 정보를 불러오지 못했습니다.');
        }
    };

    // 프로필 사진 변경
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewImage(URL.createObjectURL(selectedFile));
        }
    };

    // 프로필 정보 입력 변경
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 비밀번호 입력 변경
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // 기존 비밀번호 확인
    const handleCheckPassword = async () => {
        if (!passwordData.currentPassword) {
            alert('기존 비밀번호를 입력해주세요.');
            return;
        }
        try {
            const res = await apiService.checkUserPassword(passwordData.currentPassword);
            if (res.data === true) {
                alert('비밀번호가 일치합니다. 이제 수정이 가능합니다.');
                setIsEditable(true);
                setPasswordData(prev => ({ ...prev, currentPassword: '' }));
            } else {
                alert('비밀번호가 일치하지 않습니다.');
                setIsEditable(false);
            }
        } catch (err) {
            console.error(err);
            alert('비밀번호 확인 중 오류가 발생했습니다.');
        }
    };

    // 프로필 수정 제출
    const handleProfileSubmit = async () => {
        setLoading(true);
        try {
            const submitData = new FormData();
            // const newFormData = {
            //     userName: formData.userName,
            //     userFullname: formData.userFullname,
            // };
            // submitData.append('formData', newFormData);

            // 변경된 텍스트 데이터만 JSON으로
            // const textData = {
            //     userName: formData.userName,
            //     userFullname: formData.userFullname,
            // };
            //
            // const jsonBlob = new Blob([JSON.stringify(textData)], {
            //     type: 'application/json'
            // });
            // submitData.append('formData', jsonBlob);

            submitData.append(
                "formData",
                new Blob([JSON.stringify({
                    userName: formData.userName,
                    userFullname: formData.userFullname
                })], { type: "application/json" })
            );

            if (file) {
                submitData.append('profileImage', file);
            }
            await apiService.updateProfile(submitData);

            // 로컬스토리지 유저 정보 업데이트 (선택사항)
            // const updatedUser = { ...loginUser, ...textData };
            // localStorage.setItem('user', JSON.stringify(updatedUser));

            alert('프로필이 성공적으로 수정되었습니다.');
            navigate('/myfeed');
        } catch (err) {
            console.error(err);
            alert('프로필 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 비밀번호 변경 제출
    const handlePasswordSubmit = async () => {
        if (!isEditable) {
            alert('먼저 기존 비밀번호를 확인해주세요.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!passwordData.newPassword) {
            alert('새 비밀번호를 입력해주세요.');
            return;
        }
        setLoading(true);
        try {
            const res =
                await apiService.changeUserPassword(passwordData.newPassword);
            if(res.data) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setIsEditable(false);
            } else {
                alert("비밀번호 변경 실패했어영");
            }
        } catch (err) {
            console.error(err);
            alert('비밀번호 변경에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="loading">Loading...</div>;

    return (
        <div className="feed-container">
            <Header />

            <div className="edit-profile-wrapper">
                <div className="edit-profile-card">
                    <div className="edit-profile-sidebar">
                        <div className={`sidebar-item ${activeSection === 'profile' ? 'active' : 'off'}`}
                             onClick={() => setActiveSection('profile')}>
                            프로필 편집
                        </div>
                        <div className={`sidebar-item ${activeSection === 'password' ? 'active' : 'off'}`}
                             onClick={() => setActiveSection('password')}>
                            비밀번호 변경
                        </div>
                        <div className={`sidebar-item ${activeSection === 'apps' ? 'active' : 'off'}`}
                             onClick={() => setActiveSection('apps')}>
                            앱 및 웹사이트
                        </div>
                    </div>

                    {activeSection === 'profile' && (
                        <>
                            <div className="edit-profile-form">
                                <div className={`form-section ${activeSection === 'profile' ? 'on' : 'off'}`}>
                                    <div className="form-group photo-section">
                                        <div className="photo-label-area">
                                            <img src={previewImage == null
                                                ? getImageUrl(formData.userAvatar)
                                                : previewImage}
                                                 alt="프로필 미리보기"
                                                 className="profile-image-large" />
                                        </div>
                                        <div className="photo-input-area">
                                            <label htmlFor="profile-upload"
                                                   className="photo-change-btn">
                                                프로필 사진 바꾸기
                                            </label>
                                            <input id="profile-upload"
                                                   type="file"
                                                   accept="image/*"
                                                   onChange={handleImageChange}
                                                   style={{ display: 'none' }} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>이름</label>
                                        <input className="edit-input"
                                               type="text"
                                               name="userFullname"
                                               placeholder={user.userFullname}
                                               value={formData.userFullname}
                                               onChange={handleProfileChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>사용자 이름</label>
                                        <input className="edit-input"
                                               type="text"
                                               name="userName"
                                               placeholder={user.userName}
                                               value={formData.userName}
                                               onChange={handleProfileChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>이메일</label>
                                        <input className="edit-input"
                                               type="text"
                                               value={user.userEmail}
                                               disabled />
                                    </div>

                                    <div className="form-group submit-section">
                                        <button className="edit-submit-btn"
                                                onClick={handleProfileSubmit}
                                                disabled={loading}>
                                            {loading ? '저장 중...' : '수정 완료'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'password' && (
                        <>
                            <div className="edit-profile-form">
                                <div className={`form-section ${activeSection === 'password' ? 'on' : 'off'}`}>
                                    <div className="form-group">
                                        <label>기존 비밀번호</label>
                                        <input className="edit-input"
                                               type="password"
                                               value={passwordData.currentPassword}
                                               onChange={handlePasswordChange}
                                               name="currentPassword"
                                               placeholder="기존 비밀번호 입력" />
                                        <button className="edit-btn"
                                                onClick={handleCheckPassword}>
                                            확인
                                        </button>
                                    </div>

                                    <div className="form-group">
                                        <label>새 비밀번호</label>
                                        <input className="edit-input"
                                               type="password"
                                               name="newPassword"
                                               value={passwordData.newPassword}
                                               onChange={handlePasswordChange}
                                               placeholder="새 비밀번호"
                                               disabled={!isEditable} />
                                    </div>

                                    <div className="form-group">
                                        <label>새 비밀번호 확인</label>
                                        <input className="edit-input"
                                               type="password"
                                               name="confirmPassword"
                                               value={passwordData.confirmPassword}
                                               onChange={handlePasswordChange}
                                               placeholder="새 비밀번호 확인"
                                               disabled={!isEditable} />
                                    </div>

                                    <div className="form-group submit-section">
                                        <button className="edit-submit-btn"
                                                onClick={handlePasswordSubmit}
                                                disabled={loading || !isEditable}>
                                            {loading ? '변경 중...' : '비밀번호 변경'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeSection === 'apps' && (
                        <>
                            <div className="edit-profile-form">
                                <div className={`form-section ${activeSection === 'apps' ? 'on' : 'off'}`}>
                                    <p>연동된 앱 및 웹사이트 관리 기능은 추후 업데이트 예정입니다.</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;