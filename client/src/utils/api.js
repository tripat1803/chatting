import axios from "axios";

export const publicAxios = axios.create({
    baseURL: "http://localhost:4000"
});

export const authAxios = axios.create({
    baseURL: "http://localhost:4000"
});

authAxios.interceptors.request.use((config) => {
    config.headers["x-auth-token"] = localStorage.getItem("chat-at");
    return config;
});

authAxios.interceptors.response.use((response) => {
    return response;
}, (err) => {
    if((err.reponse?.status === 403) && err.response?.data?.invalidToken){
        localStorage.removeItem("chat-at");
        window.location.reload();
    }
});