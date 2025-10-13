import axios from "axios";
const API=axios.create({
    baseURL:"http://localhost:1234/api/v1",
    headers: {
    "Content-Type": "application/json",
    },
})
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const SearchByCity()
