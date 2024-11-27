import { configureStore } from '@reduxjs/toolkit';
import signUpReducer  from "./Slices/SignUpSlice";
import signInSlice  from "./Slices/LoginSlice";
import twoFactorAuthReducer from './Slices/twoFactorSlice';
import confirmPasswordResetReducer from './Slices/ConfirmToChangePasswordSlice';
import PasswordResetRequestSlice from './Slices/PasswordResetRequestSlice';
export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    loginIn: signInSlice,
    requestPasswordReset: PasswordResetRequestSlice,
    twoFactorAuth: twoFactorAuthReducer,
    confirmPasswordReset: confirmPasswordResetReducer,


  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;