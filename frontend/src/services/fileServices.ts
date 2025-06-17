// import axios, { AxiosRequestConfig } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { IChangeFileData, IDownloadFileData } from '../models';
import api from './api'

// const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const getFilesList = createAsyncThunk(
    'file/getlist',
    async (username: string | undefined, { rejectWithValue }) => {
        try {
            const response = await api.get(`/file/list/${username}/`)

            // const config = {
            //     method: 'GET',
            //     url: `${BASE_URL}/file/list/${username}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // }
            // const response = await axios(config);
            // return await response.data;
            return response.data
        } catch (error) {
            return rejectWithValue('Ошибка получения списка файлов: ' + error);
        }
    }
);

export const uploadFile = createAsyncThunk(
    'file/upload',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const response = await api.post('/files/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/file/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            //     data: formData,
            // }
            // const response = await axios(config);
            // return await response.data;

            return response.data
        } catch (error) {
            return rejectWithValue('Ошибка загрузки файла: ' + error);
        }
    }
);

export const changeFile = createAsyncThunk(
    'file/update',
    async (fileData: IChangeFileData, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/files/${fileData.id}/`, fileData);

            // const config = {
            //     method: 'PATCH',
            //     url: `${BASE_URL}/file/${fileData.id}/`,
            //     headers: {
            //         'Content-Type': 'application/json',
            //         Authorization: `Token ${localStorage.getItem('token')}`
            //     },
            //     data: JSON.stringify(fileData),
            // }
            // const response = await axios(config);
            // return await response.data;

            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка изменения данных о файле: ' + error);
        }
    }
);

export const downloadFile = createAsyncThunk(
    'file/download',
    async (fileData: IDownloadFileData, { rejectWithValue }) => {
        try {
            const response = await api.get(`/files/download/${fileData.id}/`, {
                responseType: 'blob',
            });

            // const config: AxiosRequestConfig = {
            //     method: 'GET',
            //     url: `${BASE_URL}/file/download/${fileData.id}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            //     responseType: 'blob',
            // }

            // const response = await axios(config);
            // const href = URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = href;
            // link.setAttribute('download', fileData.file_name);
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // URL.revokeObjectURL(href);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileData.file_name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return fileData.id;
        } catch (error) {
            return rejectWithValue('Ошибка скачивания файла: ' + error);
        }
    }
);

export const getFileLink = createAsyncThunk(
    'file/getLink',
    async (fileId: number, { rejectWithValue }) => {
        try {
            const response = await api.get(`/files/link/${fileId}/`);

            // const config = {
            //     method: 'GET',
            //     url: `${BASE_URL}/file/link/${fileId}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // }
            // const response = await axios(config);
            // return await response.data;

            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка получения специальной ссылки на файл: ' + error);
        }
    }
);

export const deleteFile = createAsyncThunk(
    'file/delete',
    async (fileId: number, { rejectWithValue }) => {
        try {
            await api.delete(`/files/${fileId}/`);

            // const config = {
            //     method: 'DELETE',
            //     url: `${BASE_URL}/file/${fileId}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // }
            // const response = await axios(config);
            // return await response.data;

            return fileId;
        } catch (error) {
            return rejectWithValue('Ошибка удаления файла: ' + error);
        }
    }
); 