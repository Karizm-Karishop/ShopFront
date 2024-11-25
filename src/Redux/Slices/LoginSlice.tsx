
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import { showErrorToast, showSuccessToast } from '../../utilis/ToastProps';
import { LoginResponse, LoginCredentials, User } from '../../types/auth.types';

interface LoginState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  needs2FA: boolean;
  googleAuthUrl: string | null;
}

interface DecodedToken {
  user: User;
}

const loadInitialState = (): LoginState => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  let user: User | null = null;

  // Add explicit checks before parsing
  if (userStr && userStr !== 'undefined') {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error('Failed to parse user data from localStorage:', error);
      localStorage.removeItem('user'); // Clear invalid data
    }
  }

  return {
    token,
    user,
    loading: false,
    error: null,
    message: null,
    needs2FA: false,
    googleAuthUrl: null,
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


export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials>(
  'login/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>(loginUrl, credentials);
      showSuccessToast(response.data.message);
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
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
    socialLogin: (state, action) => {
      const token = action.payload;
      const decodedToken = jwtDecode<DecodedToken>(token);
      const user = decodedToken.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      state.token = token;
      state.user = user;
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.user = action.payload.data.user;
        state.message = action.payload.message;
        state.needs2FA = false;
        storeLoginData(action.payload.data);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    
  },
});

export const { logout, clearErrors ,socialLogin} = loginSlice.actions;
export default loginSlice.reducer;