import {useState} from "react";
import {MoreHorizontal} from "lucide-react";


const PostOptionMenu = ({post, currentUserId, onDelete}) => {
    const [showMenu, setShowMenu] = useState(false);
    const isOwnPost = post.userId === currentUserId; //포스트작성자와 로그인유저가 같나요?

    const handleDelete = () => {
        if (window.confirm('게시물을 삭제하시겠습니까?')) {
            onDelete(post.postId);
            setShowMenu(false);
        }
    };

    const handleReport = () => {
        alert("신고기능은 준비중입니다. 신고하기 전에.. 신고를 하지 않는 마음을 갖는 것은 어떨까요?^^");
        setShowMenu(false);
    };

    // if (!showMenu) {
    //     return (
    //         <MoreHorizontal
    //             className="post-more-icon"
    //             onClick={() => setShowMenu(true)}
    //         />
    //     )
    // }
    //
    // return (
    //     <>
    //         <div className="post-menu-overlay"
    //              onClick={() => setShowMenu(false)}>
    //             <div className="post-menu-modal">
    //                 {isOwnPost && (
    //                     <button className="post-menu-button delete"
    //                             onClick={handleDelete}>
    //                         삭제하기
    //                     </button>
    //                 )}
    //                 {!isOwnPost && (
    //                     <button className="post-menu-button"
    //                             onClick={handleReport}>
    //                         신고하기
    //                     </button>
    //                 )}
    //                 <button className="post-menu-button cancel"
    //                         onClick={() => setShowMenu(false)}>
    //                     취소
    //                 </button>
    //             </div>
    //         </div>
    //
    //     </>
    // )

    const closeMenu = () => setShowMenu(false);

    return (
        <div className="post-option-wrapper" style={{ position: "relative" }}>
            {/* 아이콘은 항상 보임 */}
            <MoreHorizontal
                className="post-more-icon"
                onClick={() => setShowMenu(!showMenu)}  // 토글 방식으로 (다시 누르면 닫힘)
            />

            {/* 메뉴가 열렸을 때만 오버레이 표시 */}
            {showMenu && (
                <div className="post-menu-overlay" onClick={closeMenu}>
                    <div
                        className="post-menu-modal"
                        onClick={(e) => e.stopPropagation()}  // 중요: 내부 클릭 시 닫히지 않게
                    >
                        {isOwnPost ? (
                            <button className="post-menu-button delete" onClick={handleDelete}>
                                삭제하기
                            </button>
                        ) : (
                            <button className="post-menu-button" onClick={handleReport}>
                                신고하기
                            </button>
                        )}
                        <button className="post-menu-button cancel" onClick={closeMenu}>
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostOptionMenu;