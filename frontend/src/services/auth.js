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
