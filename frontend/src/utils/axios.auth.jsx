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

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
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
