/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utilis/ToastProps";
import { store } from "../store";
import { uploadUrlToCloudinary } from "../../utilis/cloud";

export interface ProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  gender?: string;
  biography?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    google?: string;
  };
  genres?: string[];
  profile_picture?: string | File | null;
}

interface ProfileState {
  data: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData: ProfileData, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const user = store.getState().loginIn.user;

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      // Handle profile picture upload to Cloudinary
      let profilePictureUrl = "";
      if (profileData.profile_picture instanceof File) {
        profilePictureUrl = await uploadUrlToCloudinary(profileData.profile_picture);
      }

      // Prepare payload
      const payload: ProfileData = {
        ...profileData,
        ...(profilePictureUrl && { profile_picture: profilePictureUrl })
      };

      // Remove undefined values
      Object.keys(payload).forEach(
        (key) => payload[key as keyof ProfileData] === undefined && 
        delete payload[key as keyof ProfileData]
      );

      // Send update request
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/user/profile/${user?.user_id}`, 
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccessToast("Profile updated successfully");
      return response.data.data.user;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const user = store.getState().loginIn.user;

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/user/profile/${user?.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data.user;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch profile";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Update Profile Cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Profile Cases
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetProfileState } = profileSlice.actions;

export default profileSlice.reducer;