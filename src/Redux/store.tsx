import { configureStore } from '@reduxjs/toolkit';
import signUpReducer  from "./Slices/SignUpSlice";
import signInSlice  from "./Slices/LoginSlice";
export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    loginIn: signInSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;