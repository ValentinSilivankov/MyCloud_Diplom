import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  getUsersList,
  deleteUser,
  updateUser
} from '../../services/userServices';
import { IUser, IUserForAdmin } from '../../models';

interface InitialState {
  currentUser: IUser | null;
  storageOwner: IUser | null;
  usersList: IUserForAdmin[];
  isLoading: boolean;
  error: string;
}

const initialState: InitialState = {
  currentUser: null,
  storageOwner: null,
  usersList: [],
  isLoading: false,
  error: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setStorageOwner: (state, action: PayloadAction<IUser>) => {
      state.storageOwner = action.payload;
    },
    clearStorageOwner: (state) => {
      state.storageOwner = null;
    },
    clearUsersList: (state) => {
      state.usersList = [];
    },
    clearError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
       .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Проверка аутентификации
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.currentUser = null;
      })

      // Логин
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.storageOwner = action.payload.user; // Автоматически устанавливаем владельца хранилища
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Логаут
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.currentUser = null;
        state.storageOwner = null;
        state.usersList = [];
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Получение списка пользователей
      .addCase(getUsersList.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersList = action.payload.map((user: IUserForAdmin) => ({
          ...user,
          key: user.id.toString(),
        }));
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Обновление пользователя
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновляем в списке
        state.usersList = state.usersList.map(user => 
          user.id === action.payload.id ? action.payload : user
        );
        // Обновляем текущего пользователя если это он
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })

      // Удаление пользователя
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersList = state.usersList.filter(user => user.id !== action.payload);
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
          state.storageOwner = null;
        }
      });
  },
});

export const { 
  setStorageOwner, 
  clearStorageOwner, 
  clearUsersList, 
  clearError 
} = usersSlice.actions;

export const usersState = (state: { users: InitialState }) => state.users;
export default usersSlice.reducer;