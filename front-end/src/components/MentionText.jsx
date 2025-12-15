import React from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../service/apiService';

const MentionText = ({ text, className = '' }) => {
    const navigate = useNavigate();

    const parseMentions = (text) => {
        if (!text) return [];
        const mentionRegex = /@([가-힣a-zA-Z0-9_\.]+)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        while ((match = mentionRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index),
                });
            }
            parts.push({
                type: 'mention',
                content: match[0],      // @userName
                username: match[1],     // userName
            });
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex),
            });
        }
        return parts;
    };

    const handleMentionClick = async (userName, e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const user = await apiService.getUserByUsername(userName);
            if(user || user.userId) navigate(`/myfeed?userId=${user.userId}`);
            else console.log(`유저 '${userName}'를 찾을 수 없습니다.`);
        } catch (err) {
            console.error(`${userName} 유저 조회 실패 :`, err.message);
        }
    };
    const parts = parseMentions(text);
    return (
        <span className={className}>
            {parts.map((part, index) => {
                if (part.type === 'mention') {
                    return (
                        <>
                            <span
                                key={index}
                                className="mention-link"
                                onClick={(e) =>
                                    handleMentionClick(part.username, e)}
                                style={{
                                    color: '#0095f6',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}>
                                {part.type}
                            </span>
                            <span
                                key={index}
                                className="mention-link"
                                onClick={(e) =>
                                    handleMentionClick(part.username, e)}
                                style={{
                                    color: '#0095f6',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}>
                                {part.content}
                            </span>
                            <span
                                key={index}
                                className="mention-link"
                                onClick={(e) =>
                                    handleMentionClick(part.username, e)}
                                style={{
                                    color: '#0095f6',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}>
                                {part.username}
                            </span>
                        </>
                    );
                }
                return <span key={index}>{part.content}</span>;
            })}
        </span>
    );
};

export default MentionText;