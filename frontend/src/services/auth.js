import API from './Userapi';

// Verificar si el usuario está autenticado
export const isAuthenticated = () => !!localStorage.getItem('token');

// Función para cerrar sesión
export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
};

// Función para obtener el perfil del usuario
export const fetchUserProfile = async () => {
    try {
        const response = await API.get('profile/');
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            alert('Session expired. Please log in again.');
            logout();
        } else {
            throw error;
        }
    }
};


// src/services/authService.ts
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebaseConfig';
import axios from 'axios';

export const loginWithGoogle = async () => {
    try {
        // Inicia sesión con Google
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Obtiene el token de ID de Firebase
        const idToken = await user.getIdToken();

        // Envía el token al backend de Django
        const response = await axios.post('http://127.0.0.1:8000/users/third-party-login/', {
            token: idToken
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Maneja la respuesta del backend
        console.log('Respuesta del backend:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
};