import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000', // Use env variable or fallback to localhost
  headers: {
    'Content-Type': 'application/json',
},
});


axiosInstance.interceptors.request.use(
  function(config) {
    // Retrieve the token from localStorage for every request
    const token = localStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
