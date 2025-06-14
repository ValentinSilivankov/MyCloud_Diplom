/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ILoginFormData, IRegisterFormData, IUser } from '../models';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// Добавляем интерфейс для ответа аутентификации
interface IAuthResponse {
  user: IUser;
  csrfToken: string;
}

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Тип для ошибок axios
type AxiosError = {
  response?: {
    data?: {
      detail?: string;
      [key: string]: any;
    };
    status?: number;
  };
  message?: string;
};

/**
 * Получение CSRF токена
 */
export const fetchCSRFToken = async (): Promise<string> => {
  try {
    const response = await api.get('/api/auth/csrf/');
    return response.data.csrfToken;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.response?.data?.detail || 'Failed to fetch CSRF token');
  }
};

/**
 * Регистрация пользователя
 */
export const registerUser = createAsyncThunk<IUser, { data: IRegisterFormData; csrfToken: string }>(
  'auth/register',
  async ({ data, csrfToken }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/register/', data, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      return response.data.user;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data?.detail || 'Registration failed');
    }
  }
);

/**
 * Вход пользователя
 */
export const loginUser = async (credentials: ILoginFormData): Promise<IAuthResponse> => {
  try {
    const csrfToken = await fetchCSRFToken();
    
    const response = await api.post('/api/auth/session/login/', credentials, {
      headers: {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    
    return {
      user: response.data.user,
      csrfToken: response.data.csrfToken || csrfToken,
    };
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.response?.data?.detail || 'Login failed');
  }
};

/**
 * Выход пользователя
 */
export const logoutUser = async (): Promise<void> => {
  try {
    const csrfToken = await fetchCSRFToken();
    
    await api.post('/api/auth/session/logout/', {}, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.response?.data?.detail || 'Logout failed');
  }
};

/**
 * Проверка текущей сессии
 */
export const checkSession = async (): Promise<IUser | null> => {
  try {
    const response = await api.get('/api/auth/session/check/');
    return response.data.user;
  } catch (error) {
    return null;
  }
};

/**
 * Обновление CSRF токена
 */
export const refreshCSRFToken = async (): Promise<string> => {
  return fetchCSRFToken();
};

/**
 * Получение данных текущего пользователя
 */
export const getCurrentUser = async (): Promise<IUser> => {
  try {
    const response = await api.get('/api/auth/user/');
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.response?.data?.detail || 'Failed to fetch user data');
  }
};

/**
 * Обновление данных пользователя
 */
export const updateUser = async (userData: Partial<IUser>): Promise<IUser> => {
  try {
    const csrfToken = await fetchCSRFToken();
    
    const response = await api.patch('/api/auth/user/', userData, {
      headers: {
        'X-CSRFToken': csrfToken,
      },
    });
    
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    throw new Error(err.response?.data?.detail || 'Failed to update user');
  }
};