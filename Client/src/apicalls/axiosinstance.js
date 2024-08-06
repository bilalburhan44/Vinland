import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // or your actual backend URL
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