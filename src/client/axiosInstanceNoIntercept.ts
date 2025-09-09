import axios from "axios";

// Buat instance axios
const axiosInstanceNoIntercept = axios.create({
  withCredentials: true, // Ini memungkinkan cookie dikirim bersama dengan permintaan
  baseURL: process.env.NEXT_PUBLIC_APP_URL // Ganti dengan URL API Anda
});

// Request Interceptor
axiosInstanceNoIntercept.interceptors.request.use(
  (config) => {
    // Di sini kita bisa menambahkan cookies jika diperlukan (bisa juga otomatis dari browser)
    // config.headers['Authorization'] = `Bearer ${token}`; // contoh menambahkan header Authorization
    config.headers["Content-Type"] = "application/json";

    // Pastikan credentials diaktifkan
    config.withCredentials = true;

    return config;
  },
  (error) => {
    // Tangani error request
    return Promise.reject(error);
  }
);

export default axiosInstanceNoIntercept;
