import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/users", // URL base del backend
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
