// import axios, { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { IChangeFileData, IDownloadFileData, IFile, IFileLinkResponse } from '../models';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const getCSRFToken = async (): Promise<string> => {
  const response = await axios.get(`${BASE_URL}/api/auth/csrf/`, {
    withCredentials: true
  })
  return response.data.csrfToken
}

export const getFilesList = createAsyncThunk(
    'file/list',
    async (username: string | undefined, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/file/list/${username ? username + '/' : ''}`, {
                withCredentials: true
            })
            return response.data as IFile[]


            // const config = {
            //     method: 'GET',
            //     url: `${BASE_URL}/file/list/${username}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // }
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            // return rejectWithValue('Ошибка получения списка файлов: ' + error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка получения списка файлов')
            }
            return rejectWithValue('Неизвестная ошибка получения списка файлов')
        }
    }
);

export const uploadFile = createAsyncThunk(
    'file/upload',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken()

            const response = await axios.post(`${BASE_URL}/api/file/`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': csrfToken
                },
                // onUploadProgress: (progressEvent) => {
                //     if (progressEvent.total) {
                //         const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                //         onProgress(progress)
                //     }
                // }
            })
            return response.data as IFile

            // const config = {
            //     method: 'POST',
            //     url: `${BASE_URL}/file/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            //     data: formData,
            // }
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            // return rejectWithValue('Ошибка загрузки файла: ' + error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка загрузки файла')
            }
            return rejectWithValue('Неизвестная ошибка загрузки файла')
        }
    }
);

export const changeFile = createAsyncThunk(
    'file/update',
    async (fileData: IChangeFileData, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken()

            const response = await axios.patch(
                `${BASE_URL}/api/file/${fileData.id}/`, 
                fileData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    }
                }
            )
            return response.data as IFile

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
        } catch (error) {
            // return rejectWithValue('Ошибка изменения данных о файле: ' + error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка изменения данных о файле')
            }
            return rejectWithValue('Неизвестная ошибка изменения данных о файле')
        }
    }
);

export const downloadFile = createAsyncThunk(
    'file/download',
    async (fileData: IDownloadFileData, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/file/download/${fileData.id}/`, {
                withCredentials: true,
                responseType: 'blob'
            })

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

            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', fileData.file_name)
            document.body.appendChild(link)
            link.click()

            setTimeout(() => {
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
            }, 100)

            return { id: fileData.id, filename: fileData.file_name }

        } catch (error) {
            // return rejectWithValue('Ошибка скачивания файла: ' + error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка скачивания файла')
            }
            return rejectWithValue('Неизвестная ошибка скачивания файла')
        }
    }
);

export const getFileLink = createAsyncThunk<IFileLinkResponse, number, { rejectValue: string }>(
    'file/getLink',
    async (fileId, { rejectWithValue })=> {
        try {
            const csrfToken = await getCSRFToken()

            const response = await axios.get(`${BASE_URL}/api/file/link/${fileId}/`, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })

            return {
                special_link: response.data.link
            }

            // const config = {
            //     method: 'GET',
            //     url: `${BASE_URL}/file/link/${fileId}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // }
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            // return rejectWithValue('Ошибка получения специальной ссылки на файл: ' + error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка получения ссылки на файл')
            }
            return rejectWithValue('Неизвестная ошибка получения ссылки на файл')
        }        
    }
);

export const deleteFile = createAsyncThunk(
    'file/delete',
    async (fileId: number, { rejectWithValue }) => {
        try {
            const csrfToken = await getCSRFToken()
            
            await axios.delete(`${BASE_URL}/api/file/${fileId}/`, {
                withCredentials: true,
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            
            return fileId

            // const config = {
            //     method: 'DELETE',
            //     url: `${BASE_URL}/file/${fileId}/`,
            //     headers: { Authorization: `Token ${localStorage.getItem('token')}` },
            // }
            // const response = await axios(config);
            // return await response.data;
        } catch (error) {
            // return rejectWithValue('Ошибка удаления файла: ' + error);
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.detail || 'Ошибка удаления файла')
            }
            return rejectWithValue('Неизвестная ошибка удаления файла')
        }
    }
); 