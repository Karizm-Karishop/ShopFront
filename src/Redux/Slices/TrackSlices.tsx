import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utilis/ToastProps';

interface TrackMetadata {
  file?: {
    url: string;
    originalName: string;
    mimetype: string;
    size: number;
  };
  artistName: string;
}

interface Track {
  id?: number;
  title: string;
  artist: string;
  genre: string;
  release_date: string;
  description?: string;
  file?: string;
  media_url?: string;
  metadata?: TrackMetadata;
}

interface TrackState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
  currentAlbumId: number | null;
}

const initialState: TrackState = {
  tracks: [],
  loading: false,
  error: null,
  currentAlbumId: null
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/tracks/upload`;

export const createTracks = createAsyncThunk(
  'tracks/createTracks',
  async (
    trackData: { 
      album_id: number; 
      tracks: Track[] 
    }, 
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      console.log('Tracks Upload Payload:', {
        album_id: trackData.album_id,
        tracks: trackData.tracks.map(track => ({
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          release_date: track.release_date,
          description: track.description || '',
          file: track.file || ''
        }))
      });

      const payload = {
        album_id: trackData.album_id,
        tracks: trackData.tracks.map(track => ({
          title: track.title,
          artist: track.artist,
          genre: track.genre,
          release_date: track.release_date,
          description: track.description || '',
          file: track.file || ''
        }))
      };

      const response = await axios.post(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast(
        payload.tracks.length > 1 
          ? 'Multiple tracks created successfully' 
          : 'Track created successfully'
      );
      
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create tracks';
      showErrorToast(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setTracks: (state, action: PayloadAction<Track[]>) => {
      state.tracks = action.payload;
    },
    
    addTrack: (state, action: PayloadAction<Track>) => {
      state.tracks.push(action.payload);
    },
    
    removeTrack: (state, action: PayloadAction<number>) => {
      state.tracks.splice(action.payload, 1);
    },
    
    setCurrentAlbumId: (state, action: PayloadAction<number>) => {
      state.currentAlbumId = action.payload;
    },
    
    resetTrackState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = [];
        state.tracks = action.payload.data;
      })
      .addCase(createTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setTracks,
  addTrack,
  removeTrack,
  setCurrentAlbumId,
  resetTrackState
} = trackSlice.actions;

export default trackSlice.reducer;