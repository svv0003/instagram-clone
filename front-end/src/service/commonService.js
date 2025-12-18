export const API_BASE_URL = 'https://13.125.72.19:9000';

export const getImageUrl = (path) => {
    if(!path) return '/static/img/default-avatar.jpg';
    if(path.startsWith('http')) return path;
    if(!path.startsWith('http')) {
        if(path ==='default-avatar.jpg') return '/static/img/default-avatar.jpg';
        if(path ==='default-avatar.png') return '/static/img/default-avatar.jpg';
        if(path.startsWith('/static/img')) return path;
        return `${API_BASE_URL}${path}`;
    }
    return `${API_BASE_URL}${path}`;
    // return `http://localhost:9000${path}`;
}

export const formatDate = (dateString, format="relative") => {
    const date = new Date(dateString);
    const now = new Date();
    if(format === 'absolute'){
        const year = date.getFullYear();
        const month = String(date.getMonth()+1).padStart(2,"0");
        const day = String(date.getDate()).padStart(2,"0");
        return `${year}-${month}-${day}`;
    }
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs/1000);
    const diffInMinutes = Math.floor(diffInSeconds/60);
    const diffInHours = Math.floor(diffInMinutes/60);
    const diffInDays = Math.floor(diffInHours/24);
    if(diffInSeconds<60) return "방금 전";
    else if (diffInMinutes<60) return `${diffInMinutes}분 전`;
    else if (diffInHours<24) {
        const minutes = diffInMinutes%60;
        if(minutes>0) return `${diffInHours}시간 ${minutes}분 전`;
        return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) return `${diffInDays}일 전`;
    else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}