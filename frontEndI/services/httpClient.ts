import axios from 'axios';
import { API_URL } from './api';

const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally attach token
// httpClient.interceptors.request.use(async (config) => {
//   // You can load token from AsyncStorage or SecureStore
//   const token = await getToken(); // implement getToken()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// Global error handling
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('HTTP Error:', error.response?.data || error.message);
    // You can handle global errors here (e.g., redirect to login on 401)
    return Promise.reject(error);
  }
);

export default httpClient;

