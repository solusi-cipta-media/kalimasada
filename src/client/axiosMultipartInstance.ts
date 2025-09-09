import axios from "axios";

// Buat instance axios
const axiosMultipartInstance = axios.create({
  withCredentials: true, // Ini memungkinkan cookie dikirim bersama dengan permintaan
  baseURL: process.env.NEXT_PUBLIC_APP_URL // Ganti dengan URL API Anda
});

// Request Interceptor
axiosMultipartInstance.interceptors.request.use(
  (config) => {
    // Di sini kita bisa menambahkan cookies jika diperlukan (bisa juga otomatis dari browser)
    // config.headers['Authorization'] = `Bearer ${token}`; // contoh menambahkan header Authorization

    // Pastikan credentials diaktifkan
    config.withCredentials = true;

    return config;
  },
  (error) => {
    // Tangani error request
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosMultipartInstance.interceptors.response.use(
  (response) => {
    // Kita bisa melakukan modifikasi pada response di sini, jika diperlukan
    return response;
  },
  (error) => {
    // Tangani error response, seperti handling 401 atau 403
    if (error.response?.status === 401) {
      // Misal, redirect ke login jika unauthorized
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosMultipartInstance;
