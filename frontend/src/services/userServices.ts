import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ILoginFormData, IRegisterFormData, IUpdateUserData } from '../models'

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const getCSRFToken = async () => {
  const response = await axios.get(`${BASE_URL}/api/auth/csrf/`, {
    withCredentials: true
  });
  return response.data.csrfToken;
};

const checkSession = async () => {
  const response = await axios.get(`${BASE_URL}/api/auth/session/check/`, {
    withCredentials: true
  });
  return response.data;
};


export const registerUser = createAsyncThunk(
    'user/register',
    async (formData: IRegisterFormData, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken();

            const data = {
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            };

            const response = await axios.post(`${BASE_URL}/api/user/`, data, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                }
            });

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/user/`,
            //     headers: { 'Content-Type': 'application/json' },
            //     data: JSON.stringify(data),
            // };
            // const response = await axios(config);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка регистрации');
            }
            return rejectWithValue('Неизвестная ошибка регистрации');
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (formData: ILoginFormData, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken();

            const response = await axios.post(`${BASE_URL}/api/auth/session/login/`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                }
            });

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/user/login/`,
            //     headers: { 'Content-Type': 'application/json' },
            //     data: JSON.stringify(formData),
            // };
            // const response = await axios(config);

            const sessionData = await checkSession();
            // return await response.data;
            return {
                user: sessionData.user,
                csrfToken: response.data.csrfToken
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка входа');
            }
            return rejectWithValue('Неизвестная ошибка входа');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken();

            await axios.post(`${BASE_URL}/api/auth/session/logout/`, {}, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken
                }
            });

            return true;

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/user/logout/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // };
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка выхода');
            }
            return rejectWithValue('Неизвестная ошибка выхода');
        }
    }
);

export const getUsersList = createAsyncThunk(
    'user/list',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/user/`, {
                withCredentials: true
            });
            return response.data

            // const config = {
            //     method: 'GET',
            //     url: `${BASE_URL}/user/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // };
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка получения списка пользователей');
            }
            return rejectWithValue('Неизвестная ошибка получения списка пользователей');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async (userData: IUpdateUserData, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken();
            const response = await axios.patch(`${BASE_URL}/api/user/${userData.id}/`, userData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                }
            });
            
            return response.data;

            // const config = {
            //     method: 'PATCH',
            //     url: `${BASE_URL}/user/${userData.id}/`,
            //     headers: {
            //     'Content-Type': 'application/json',
            //     Authorization: `Token ${localStorage.getItem('token')}`
            //     },
            //     data: JSON.stringify(userData),
            // };
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка обновления пользователя');
            }
            return rejectWithValue('Неизвестная ошибка обновления пользователя');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken();

            await axios.delete(`${BASE_URL}/api/user/${id}/`, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken
                }
            });
            
            return id;

            // const config = {
            //     method: 'DELETE',
            //     url: `${BASE_URL}/user/${id}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // };
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка удаления пользователя');
            }
            return rejectWithValue('Неизвестная ошибка удаления пользователя');
        }
    }
);

export const checkAuthSession = createAsyncThunk(
  'user/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await checkSession();
      return response.user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(null);
      }
      return rejectWithValue(null);
    }
  }
);