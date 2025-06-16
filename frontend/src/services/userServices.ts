// import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { 
    ILoginFormData, 
    IRegisterFormData, 
    IUpdateUserData, 
    IUserForAdmin,
} from '../models'
import { authFetch } from './api'

// const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const registerUser = createAsyncThunk(
    'user/register',
    async (formData: IRegisterFormData, { rejectWithValue }) => {
        try {
            const response = await authFetch('/user/', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

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
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            // return rejectWithValue('Ошибка на стороне сервера: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Registration error');
        }
    }
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (formData: ILoginFormData, { rejectWithValue }) => {
        try {
            const response = await authFetch('/user/login/', {
                method: 'POST',
                body: JSON.stringify(formData),
            });

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/user/login/`,
            //     headers: { 'Content-Type': 'application/json' },
            //     data: JSON.stringify(formData),
            // };
            // const response = await axios(config);
            // return await response.data;

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const data = await response.json();

            // return await response.json();
            return { user: data.user };


        } catch (error) {
            // if (axios.isAxiosError(error) && error.response) {
            //     return rejectWithValue('Ошибка входа: ' + error.response.data.non_field_errors[0]);
            // }
            // return rejectWithValue('Неизвестная ошибка входа');
            return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authFetch('/user/logout', {
                method: 'POST',
            });

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/user/logout/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // };
            // const response = await axios(config);
            // return await response.data;

            if (!response.ok) {
                throw new Error('Logout failed');
            }
            return await response.json();
        } catch (error) {
            // return rejectWithValue('Ошибка выхода пользователя из системы: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Unknow error');
        }
    }
);

export const getUsersList = createAsyncThunk(
    'user/getAll',
    // 'user/list',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authFetch('/user/admin/', {
                method: 'GET',
            });

            // const config = {
            //     method: 'GET',
            //     url: `${BASE_URL}/user/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // };
            // const response = await axios(config);
            // return await response.data;

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to fetch users');
            }

            const users: IUserForAdmin[] = await response.json();
            return users.map(user => ({
                ...user,
                key: user.id.toString(), // Для совместимости с Ant Design Table
            }));
        } catch (error) {
            // return rejectWithValue('Ошибка получения списка пользователей: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch users');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/update',
    async (userData: IUpdateUserData, { rejectWithValue }) => {
        try {
            const response = await authFetch(`/user/${userData.id}/`, {
                method: 'PATCH',
                body: JSON.stringify(userData),
            });

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

            if (!response.ok) {
                throw new Error('Update failed');
            }

            return await response.json();
        } catch (error) {
            // return rejectWithValue('Ошибка редактирования данных пользователя: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Update error');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/delete',
    async (userId: number, { rejectWithValue }) => {
        try {
            const response = await authFetch(`/user/admin/${userId}/`, {
                method: 'DELETE',
            });

            // const config = {
            //     method: 'DELETE',
            //     url: `${BASE_URL}/user/${id}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // };
            // const response = await axios(config);
            // return await response.data;
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete user');
            }

            return userId;
        } catch (error) {
            // return rejectWithValue('Ошибка удаления пользователя: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete user');
        }
    }
);

export const toggleAdminStatus = createAsyncThunk(
  'user/toggleAdmin',
  async ({ userId, isAdmin }: { userId: number; isAdmin: boolean }, { rejectWithValue }) => {
    try {
      const response = await authFetch(`/user/admin/${userId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_staff: !isAdmin }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update user');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'user/current',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authFetch('/user/current/');

      if (!response.ok) {
        // Если 401 - пользователь не аутентифицирован
        if (response.status === 401) {
          return rejectWithValue('Not authenticated');
        }
        throw new Error('Failed to get current user');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get current user');
    }
  }
);