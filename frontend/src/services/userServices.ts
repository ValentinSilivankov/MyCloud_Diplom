/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { IAuthResponse, ILoginFormData, IRegisterFormData, IUpdateUserData } from '../models'
import api from '../services/api';

// const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const registerUser = createAsyncThunk(
    'user/register',
    async (formData: IRegisterFormData, { rejectWithValue }) => {
        try {
            const response = await api.post('/user/',{
                username: formData.username,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password,
            })
            // const data = {
            //     username: formData.username,
            //     first_name: formData.first_name,
            //     last_name: formData.last_name,
            //     email: formData.email,
            //     password: formData.password,
            // };
            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/user/`,
            //     headers: { 'Content-Type': 'application/json' },
            //     data: JSON.stringify(data),
            // };
            // const response = await axios(config);
            // return await response.data;

            return response.data
        } catch (error : any) {
            if (error.response?.data) {
                return rejectWithValue(
                    error.response.data.non_field_errors?.[0] ||
                    Object.values(error.response.data)[0] ||
                    'Registration failed'
                );
            }
            return rejectWithValue('Network error');
        }
        // } catch (error) {
        //     return rejectWithValue('Ошибка на стороне сервера: ' + error);
        // }
    }
);

export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<IAuthResponse>('/user/check-auth/');
            return response.data;
        } catch (error) {
            return rejectWithValue('Authentication check failed' + error);
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (formData: ILoginFormData, { rejectWithValue }) => {
        try {
            const response = await api.post('/user/login/', formData);
            return response.data;

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/user/login/`,
            //     headers: { 'Content-Type': 'application/json' },
            //     data: JSON.stringify(formData),
            // };
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue('Ошибка входа: ' + error.response.data.non_field_errors[0]);
            }
            return rejectWithValue('Неизвестная ошибка входа');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/user/logout/', {}, {
                withCredentials: true
            });

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/user/logout/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // };
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            return rejectWithValue('Ошибка выхода пользователя из системы: ' + error);
        }
    }
);

export const getUsersList = createAsyncThunk(
    'user/list',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/');

            // const config = {
            //     method: 'GET',
            //     url: `${BASE_URL}/user/`,
            //     headers: { 'Content-Type': 'application/json' },
            // };
            // const response = await axios(config);
            // return await response.data;

            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка получения списка пользователей: ' + error);
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async (userData: IUpdateUserData, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/user/${userData.id}/`, userData);

            // const config = {
            //     method: 'PATCH',
            //     url: `${BASE_URL}/user/${userData.id}/`,
            //     headers: {'Content-Type': 'application/json'},
            //     data: JSON.stringify(userData),
            // };
            // const response = await axios(config);
            // return await response.data;

            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка редактирования данных пользователя: ' + error);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`/user/${id}/`);

            // const config = {
            //     method: 'DELETE',
            //     url: `${BASE_URL}/user/${id}/`,
            //     headers: { 'Content-Type': 'application/json' },
            // };
            // const response = await axios(config);
            // return await response.data;

            return id;
        } catch (error) {
            return rejectWithValue('Ошибка удаления пользователя: ' + error);
        }
    }
);

