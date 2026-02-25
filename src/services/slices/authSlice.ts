import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  getUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '../../utils/burger-api';
import { TUser } from '../../utils/types';

interface AuthState {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
}

export const login = createAsyncThunk(
  'auth/login',
  async (data: { email: string; password: string }) => {
    const response = await loginUserApi(data);
    return response.user;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { email: string; password: string; name: string }) => {
    const response = await registerUserApi(data);
    return response.user;
  }
);

export const fetchUser = createAsyncThunk('auth/user', async () => {
  const response = await getUserApi();
  return response.user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
});

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: { name: string; email: string; password: string }) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  } as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthChecked = true;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Update failed';
      });
  }
});

export default authSlice.reducer;
