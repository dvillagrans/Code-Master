import api from "./axios";

export const loginUser = async (username, password) => {
    const response = await api.post("/token/", {
        username,
        password,
    });
    return response.data; // { access, refresh }
};

export const registerUser = async (userData) => {
    const response = await api.post("/register/", userData);
    return response.data;
};

export const getProfile = async (token) => {
    const response = await api.get("/profile/", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
