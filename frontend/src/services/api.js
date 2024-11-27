import axios from 'axios';

// Configuración base para Axios
const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Cambia esta URL a la de tu backend
});

// Interceptor para agregar el token JWT a las solicitudes
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
