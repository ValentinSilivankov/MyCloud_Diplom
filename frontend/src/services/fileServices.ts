import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { IChangeFileData, IDownloadFileData } from '../models';
import { authFetch } from './api'
import { getCSRFToken } from './api';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// async function getCSRFToken(): Promise<string> {
//   const response = await fetch('/api/csrf/', {
//     credentials: 'include',
//   });
//   const { csrfToken } = await response.json();
//   return csrfToken;
// }

export const getFilesList = createAsyncThunk(
    'file/list',
    async (username: string | undefined, { rejectWithValue }) => {
        try {
            const response = await authFetch(`/file/list/${username}/`);


            // const config = {
            //     method: 'GET',
            //     url: `${BASE_URL}/file/list/${username}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // }
            // const response = await axios(config);
            // return await response.data;

            if (!response.ok) {
                throw new Error('Failed to get files list');
            }

            return await response.json();
        } catch (error) {
            // return rejectWithValue('Ошибка получения списка файлов: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Files fetch error');
        }
    }
);

export const uploadFile = createAsyncThunk(
    'file/upload',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken();
            const response = await fetch('/api/file/', {
                method: 'POST',
                headers: {
                'X-CSRFToken': csrfToken,
            },
            body: formData,
            credentials: 'include',
        });

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/file/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            //     data: formData,
            // }
            // const response = await axios(config);
            // return await response.data;

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            return await response.json();
        } catch (error) {
            // return rejectWithValue('Ошибка загрузки файла: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Upload error');
        }
    }
);

export const changeFile = createAsyncThunk(
    'file/update',
    async (fileData: IChangeFileData, { rejectWithValue }) => {
        try {
            const config = {
                method: 'PATCH',
                url: `${BASE_URL}/file/${fileData.id}/`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('token')}`
                },
                data: JSON.stringify(fileData),
            }
            const response = await axios(config);
            return await response.data;
        } catch (error) {
            return rejectWithValue('Ошибка изменения данных о файле: ' + error);
        }
    }
);

export const downloadFile = createAsyncThunk(
    'file/download',
    async (fileData: IDownloadFileData, { rejectWithValue }) => {
        try {
            const response = await authFetch(`/file/download/${fileData.id}/`);

            if (!response.ok) {
                throw new Error('Download failed');
            }

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

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileData.file_name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            return fileData.id
        } catch (error) {
            // return rejectWithValue('Ошибка скачивания файла: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Download error');
        }
    }
);

export const getFileLink = createAsyncThunk(
    'file/getLink',
    async (fileId: number, { rejectWithValue }) => {
        try {
            const config = {
                method: 'GET',
                url: `${BASE_URL}/file/link/${fileId}/`,
                headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            }
            const response = await axios(config);
            return await response.data;
        } catch (error) {
            return rejectWithValue('Ошибка получения специальной ссылки на файл: ' + error);
        }
    }
);

export const deleteFile = createAsyncThunk(
    'file/delete',
    async (fileId: number, { rejectWithValue }) => {
        try {
            const response = await authFetch(`/file/${fileId}/`, {
                method: 'DELETE',
            });

            // const config = {
            //     method: 'DELETE',
            //     url: `${BASE_URL}/file/${fileId}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // }
            // const response = await axios(config);
            // return await response.data;

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            return fileId;
        } catch (error) {
            // return rejectWithValue('Ошибка удаления файла: ' + error);
            return rejectWithValue(error instanceof Error ? error.message : 'Delete error');
        }
    }
); 