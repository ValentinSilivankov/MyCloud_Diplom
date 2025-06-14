import { PayloadAction } from '@reduxjs/toolkit'

// Базовые интерфейсы
export interface IError {
  errMessage: string;
  errFunc?: PayloadAction<string | number>;
  statusCode?: number;
}

// Сессионная аутентификация
export interface IAuthSession {
  isAuthenticated: boolean;
  csrfToken?: string;
  user?: IUser;
}

export interface ILoginResponse {
  user: IUser;
  csrfToken?: string;
}

// Файлы
export interface IFile {
  id: number;
  key: string;
  file_name: string;
  comment: string;
  size: number;
  uploaded: string; // ISO format
  downloaded: string; // ISO format
  specialLink: string;
  mime_type?: string;
  owner?: IUserShort;
}

export interface IFileUpload {
  file: File;
  title?: string;
  comment?: string;
  onProgress?: (progress: number) => void;
}

export interface IDownloadFile {
  id: number;
  url: string;
  filename: string;
}

export interface IFilesSize {
  size: number;
  str_size: string;
}

export interface IChangeFileData {
  id: number;
  file_name?: string;
  comment?: string | null;
}

export interface IDownloadFileData {
  id: number;
  file_name: string;
}

export interface IUploadOptions {
  formData: FormData;
  onProgress?: (progress: number) => void;
}

// Пользователи
export interface IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  is_staff: boolean;
  is_active?: boolean;
}

export interface IUserShort {
  id: number;
  username: string;
  email: string;
}

export interface IUserForAdmin {
  id: number;
  key: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  is_staff: boolean;
  files: IFilesSize[];
}

// Формы
export interface ILoginFormData {
  username: string;
  password: string;
  remember?: boolean;
}

export interface IRegisterFormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  repeat_password?: string;
}

export interface IUpdateUserData {
  id: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
}

// API ответы
export interface IApiResponse<T> {
  data?: T;
  error?: IError;
}

// Redux состояние
export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: IError | null;
  csrfToken: string | null;
}

export interface IFilesState {
  files: IFile[];
  currentFile: IFile | null;
  isLoading: boolean;
  error: IError | null;
  storageUsage: IFilesSize | null;
}

export interface IFileLinkResponse {
  special_link: string;
}