import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:1234/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const RegisterUser = async (userData) => {
  try {
    const { data } = await API.post("/user/register", userData);
    return data;
  } catch (err) {
    throw err.response?.data?.message || "Registration failed";
  }
};
export const loginUser = async (userData) => {
  try {
    const { data } = await API.post("/user/login", userData);
    // Backend returns ApiResponse { data: { user, accesstoken, refreshtoken }, ... }
    const payload = data?.data || {};
    const accessToken = payload.accesstoken;
    const user = payload.user;
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
    return data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
export const searchByCity = (destination) => 
  API.get(`/search/city?destination=${destination}`);

export default API
