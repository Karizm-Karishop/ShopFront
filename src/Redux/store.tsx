import { configureStore } from '@reduxjs/toolkit';
import signUpReducer  from "./Slices/SignUpSlice";
import signInSlice  from "./Slices/LoginSlice";
import twoFactorAuthReducer from './Slices/twoFactorSlice';
import confirmPasswordResetReducer from './Slices/ConfirmToChangePasswordSlice';
import PasswordResetRequestSlice from './Slices/PasswordResetRequestSlice';
import albumReducer from './Slices/AblumSlices';
import AddMusicReducer from './Slices/TrackSlices';
import TrackReducer from './Slices/TrackSlices'
import ProductReducer from './Slices/addProductSlice'
import categorySlice from "./Slices/CategorySlice";
import categoryReducer from "./Slices/CategorySlices";
import bookReducer from './Slices/Bookslices'
import profile from './Slices/ProfileSlices'

export const store = configureStore({
  reducer: {
    signUp: signUpReducer,
    loginIn: signInSlice,
    requestPasswordReset: PasswordResetRequestSlice,
    twoFactorAuth: twoFactorAuthReducer,
    confirmPasswordReset: confirmPasswordResetReducer,
    album: albumReducer,
    music: AddMusicReducer,
    tracks: TrackReducer,
    product: ProductReducer,
    categories:categorySlice,
    category:categoryReducer,
    book:bookReducer,
    profile: profile

  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;