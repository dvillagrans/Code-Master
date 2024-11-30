import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // Cambia esto según tu configuración
    headers: {
        'Content-Type': 'application/json',
    },
});

// Agregar el token automáticamente
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
