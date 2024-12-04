/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { showErrorToast, showSuccessToast } from '../../utilis/ToastProps';
import { LoginResponse, LoginCredentials, User } from '../../types/auth.types';
import { NavigateFunction } from 'react-router-dom';

interface LoginState {
  user_id: number;
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  needs2FA: boolean;
  googleAuthUrl: string | null;
  isEmailUnverified: boolean;
}

interface DecodedToken {
  userId: number;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  profile_picture: string | null;
  iat: number;
  exp: number;
}

const loadInitialState = (): LoginState => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  return {
    token,
    user,
    loading: false,
    error: null,
    message: null,
    needs2FA: false,
    googleAuthUrl: null,
    isEmailUnverified: false
  };
};

const storeLoginData = (data: { user: User; token: string }) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
};

const clearLoginData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

const BASE_URL = import.meta.env.VITE_BASE_URL;
const loginUrl = `${BASE_URL}/user/login`;

export const socialLoginAction = createAsyncThunk<
  { token: string; navigate: NavigateFunction },
  { token: string; navigate: NavigateFunction }
>(
  'login/socialLogin',
  async ({ token, navigate }, { rejectWithValue }) => {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);

      const userData: User = {
        user_id: decodedToken.userId,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        email: decodedToken.email,
        profile_picture: decodedToken.profile_picture,
        role: decodedToken.role,
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      showSuccessToast(`${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} logged in successfully`);

      switch (userData.role.toLowerCase()) {
        case 'artist':
          navigate('/dashboard');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'client':
        default:
          navigate('/');
          break;
      }

      return { token, navigate };
    } catch (error: any) {
      showErrorToast('Social login failed');
      return rejectWithValue('Social login failed');
    }
  }
);

export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials & { navigate: NavigateFunction }>(
  'login/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(loginUrl, credentials);
      showSuccessToast(response.data.message);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      const isEmailUnverified = error.response?.data?.error === 'Email not verified';
      
      if (isEmailUnverified) {
        showErrorToast('Please verify your email. A new verification link has been sent.');
      } else {
        showErrorToast(errorMessage);
      }
      
      return rejectWithValue({ 
        errorMessage, 
        isEmailUnverified 
      });
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: loadInitialState(),
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.googleAuthUrl = null;
      clearLoginData();
    },
    clearErrors: (state) => {
      state.error = null;
      state.message = null;
    },
    clearEmailUnverifiedStatus: (state) => {
      state.isEmailUnverified = false;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.isEmailUnverified = false;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.data.token;
      state.user = action.payload.data.user;
      state.message = action.payload.message;
      state.needs2FA = false;
      state.isEmailUnverified = false;
      storeLoginData(action.payload.data);
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      const payload = action.payload as { errorMessage: string, isEmailUnverified?: boolean };
      state.error = payload.errorMessage;
      state.isEmailUnverified = payload.isEmailUnverified || false;
    })
      .addCase(socialLoginAction.fulfilled, (state, action) => {
        const decodedToken = jwtDecode<DecodedToken>(action.payload.token);
        state.token = action.payload.token;
        state.user = {
          user_id: decodedToken.userId,
          firstName: decodedToken.firstName,
          lastName: decodedToken.lastName,
          email: decodedToken.email,
          profile_picture: decodedToken.profile_picture,
          role: decodedToken.role,
        };
      })
      .addCase(socialLoginAction.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearErrors ,clearEmailUnverifiedStatus} = loginSlice.actions;
export default loginSlice.reducer;