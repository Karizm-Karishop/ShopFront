import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utilis/ToastProps';
interface albumState {
  title: string;
  description: string;
  coverImage: File | null;
  coverImageUrl: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: albumState = {
  title: '',
  description: '',
  coverImage: null,
  coverImageUrl: null,
  loading: false,
  error: null,
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/albums`;
export const createAlbum = createAsyncThunk(
  'album/createalbum',
  async (
    albumData: { 
      title: string; 
      description: string; 
      coverImage: File | null 
    }, 
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const formData = new FormData();
      formData.append('album_title', albumData.title);
      
      if (albumData.description) {
        formData.append('description', albumData.description);
      }

      if (albumData.coverImage) {
        formData.append('cover_image', albumData.coverImage);
      }

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast('album created successfully');
      
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create album';
      showErrorToast(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

const albumSlice = createSlice({
  name: 'album',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setCoverImage: (state, action: PayloadAction<File | null>) => {
      state.coverImage = action.payload;
    },
    setCoverImageUrl: (state, action: PayloadAction<string | null>) => {
      state.coverImageUrl = action.payload;
    },
    resetalbumState: () => initialState

  },
  extraReducers: (builder) => {
    builder
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.coverImageUrl = action.payload.data?.cover_image || null;
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTitle,
  setDescription,
  setCoverImage,
  setCoverImageUrl,
  resetalbumState,
} = albumSlice.actions;

export default albumSlice.reducer;