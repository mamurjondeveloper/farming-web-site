import axios from "axios";

// Backend API manzili bitta joyda boshqarilishi uchun alohida client
const api = axios.create({
  baseURL: "",
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar JWT token muddati tugagan bo'lsa yoki yaroqsiz bo'lsa (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      
      // Faqatgina admin sahifalarida bo'lsak login ga qaytarish mantiqi
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

