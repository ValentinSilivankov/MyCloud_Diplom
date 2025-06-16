import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, IUserForAdmin } from '../../models';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUser,
  getUsersList,
  deleteUser,
  toggleAdminStatus
} from '../../services/userServices';
import { RootState } from '../store';

interface UserState {
  currentUser: IUser | null;
  usersList: IUserForAdmin[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  usersList: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setStorageOwner: (state, action: PayloadAction<IUser>) => {
      if (state.currentUser) {
        state.currentUser = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.currentUser = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.currentUser = null;
      })
      
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
       .addCase(getUsersList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersList = action.payload;
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.usersList = state.usersList.filter(user => user.id !== action.payload);
        
        // Если удалён текущий пользователь
        if (state.currentUser?.id === action.payload) {
          state.currentUser = null;
        }
      })
      
      .addCase(toggleAdminStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.usersList = state.usersList.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        );
        
        // Если это текущий пользователь
        if (state.currentUser?.id === updatedUser.id) {
          state.currentUser = updatedUser;
        }
      });
      
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
export const usersState = (state: RootState) => state.users;
export const selectCurrentUser = (state: { users: UserState }) => state.users.currentUser;
export const selectUsersList = (state: { users: UserState }) => state.users.usersList;
export const selectUserLoading = (state: { users: UserState }) => state.users.isLoading;
export const selectUserError = (state: { users: UserState }) => state.users.error;