
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showErrorToast, showSuccessToast } from '../../utilis/ToastProps';
interface SignUpState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'artist' | 'client';
  loading: boolean;
  error: string | null;
}

const initialState: SignUpState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'client',
  loading: false,
  error: null,
};
const apiUrl = `${import.meta.env.VITE_BASE_URL}/user/register`;

export const registerUser = createAsyncThunk(
  'signUp/registerUser',
  async (
    userData: Omit<SignUpState, 'loading' | 'error'>,
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await axios.post(apiUrl, userData);
      showSuccessToast('User registered successfully! Please check your email.');
      
      dispatch(setEmail(userData.email));
      
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Something went wrong';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setUserType: (state, action: PayloadAction<'artist' | 'client'>) => {
      state.role = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { setFirstName, setLastName, setEmail, setPassword, setUserType } =
  signUpSlice.actions;

export default signUpSlice.reducer;