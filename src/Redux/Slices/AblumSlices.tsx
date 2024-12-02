/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utilis/ToastProps';

export interface Album {
  totalDownloads: number;
  id: number;
  album_title: string;
  description?: string;
  cover_image?: string;
  created_at: Date;
  updated_at: Date;
  tracks?: any[];
}

interface AlbumState {
  albums: Album[];
  selectedAlbum: Album | null;
  title: string;
  description: string;
  coverImage: File | null;
  coverImageUrl: string | null;
  loading: boolean;
  error: string | null;
  totalAlbums: number;
}

const initialState: AlbumState = {
  albums: [],
  selectedAlbum: null,
  title: '',
  description: '',
  coverImage: null,
  coverImageUrl: null,
  loading: false,
  error: null,
  totalAlbums: 0,
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/albums`;

export const fetchAllAlbums = createAsyncThunk(
  'album/fetchAllAlbums',
  async (artist_id: number, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/albums/${artist_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Album Data",response.data)
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch albums';
      showErrorToast(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const createAlbum = createAsyncThunk(
  'album/createalbum',
  async (
    albumData: { 
      title: string; 
      description: string; 
      coverImage: File | null; 
      artist_id: number; 
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
      formData.append('artist_id', albumData.artist_id.toString());

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

      showSuccessToast('Album created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create album';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


export const deleteAlbum = createAsyncThunk(
  'album/deleteAlbum',
  async (albumId: number, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
       await axios.delete(`${apiUrl}/${albumId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast('Album deleted successfully');
      
      return albumId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete album';
      showErrorToast(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateAlbum = createAsyncThunk(
  'album/updateAlbum',
  async (
    albumData: { 
      id: number;
      title: string; 
      description: string; 
      coverImage: File | null ;
      
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

      const response = await axios.put(`${apiUrl}/${albumData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast('Album updated successfully');
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update album';
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
    resetAlbumState: () => initialState
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllAlbums.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllAlbums.fulfilled, (state, action) => {
      state.loading = false;
      state.albums = action.payload.data.albums;
      state.totalAlbums = action.payload.data.albums.length;
    })
    .addCase(fetchAllAlbums.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
      
      // Create Album Reducer
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums.push(action.payload.data);
        state.totalAlbums += 1;
        state.coverImageUrl = action.payload.data?.cover_image || null;
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Album Reducer
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = state.albums.filter(album => album.id !== action.payload);
        state.totalAlbums -= 1;
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.albums.findIndex(album => album.id === action.payload.data.id);
        if (index !== -1) {
          state.albums[index] = action.payload.data;
        }
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      
  },
});

export const {
  setTitle,
  setDescription,
  setCoverImage,
  setCoverImageUrl,
  resetAlbumState,
} = albumSlice.actions;

export default albumSlice.reducer;