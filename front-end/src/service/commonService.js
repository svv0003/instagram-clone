export const API_BASE_URL = 'http://localhost:9000/api';

export const getImageUrl = (path) => {
    if(!path) return '/static/img/default-avatar.jpg';
    if(path.startsWith('http')) return path;
    if(path ==='default-avatar.jpg') return '/static/img/default-avatar.jpg';
    if(path ==='default-avatar.png') return '/static/img/default-avatar.jpg';
    return `http://localhost:9000${path}`;
}