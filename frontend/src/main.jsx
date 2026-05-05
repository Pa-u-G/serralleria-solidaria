import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./pages/store/styles/main.scss";
import axios from 'axios';

// Configuració global d'axios
axios.defaults.baseURL = 'http://localhost:8000/api';

// Interceptor per afegir token automàticament
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor per gestionar errors 401
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 No redirigim a login si la petició és a /login
    const isLoginRequest = error.config?.url === '/login';
    const isRegisterRequest = error.config?.url === '/register';
    
    if (error.response?.status === 401 && !isLoginRequest && !isRegisterRequest) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);