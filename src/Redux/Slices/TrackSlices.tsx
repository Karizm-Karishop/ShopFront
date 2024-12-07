/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utilis/ToastProps";
import { store } from "../store";

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
  track_id?: number;
  id?: number;
  title: string;
  artist: string;
  genre: string;
  release_date: string;
  description?: string;
  file?: string;
  media_url?: string;
  album_id?: number;
  metadata?: TrackMetadata;
}

export interface UpdateTrackPayload {
  id: number;
  title?: string;
  genre?: string;
  description?: string;
  release_date?: string;
  album_id?: number;
  artist_id?: number;
  media_url?: string;
  file?: string;
  mimetype?: string;
  fileSize?: number;
}



interface TrackState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
  currentAlbumId: number | null;
  selectedTrack?: any;
  totalTracks: number;
}

const initialState: TrackState = {
  tracks: [],
  loading: false,
  error: null,
  currentAlbumId: null,
  totalTracks: 0,
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/tracks/upload`;
const apiUrlDelete = `${import.meta.env.VITE_BASE_URL}/tracks/single`;

export const createTracks = createAsyncThunk(
  "tracks/createTracks",
  async (
    trackData: {
      album_id: number;
      tracks: Track[];
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    const user = store.getState().loginIn.user;

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const payload = {
        album_id: trackData.album_id,
        artist_id: user?.user_id,
        tracks: trackData.tracks.map((track) => ({
          title: track.title,
          artist: track.artist || user?.firstName,
          genre: track.genre,
          release_date: track.release_date,
          description: track.description || "",
          file: track.file || "",
        })),
      };

      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast(
        payload.tracks.length > 1
          ? "Multiple tracks created successfully"
          : "Track created successfully"
      );

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create tracks";
      showErrorToast(errorMessage);

      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteTrack = createAsyncThunk(
  "Track/deleteTrack",
  async (trackId: number, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.delete(`${apiUrlDelete}/${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Deleted Data", response);

      showSuccessToast("Track deleted successfully");
      return trackId;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete Track";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateTrack = createAsyncThunk(
  'tracks/updateTrack',
  async (trackData: UpdateTrackPayload, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const payload: any = { ...trackData };

      const { id, ...updateData } = payload;

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/tracks/${id}`, 
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccessToast('Track updated successfully');
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update track';
      showErrorToast(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchArtistTracks = createAsyncThunk(
  "tracks/fetchArtistTracks",
  async (artist_id: number, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/tracks/${artist_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      const errorMessage = "No Tracks Found For This artist";

      return rejectWithValue(errorMessage);
    }
  }
);

const trackSlice = createSlice({
  name: "tracks",
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
    setSelectedTrack: (state, action: PayloadAction<any>) => {
      state.selectedTrack = action.payload;
    },

    resetTrackState: () => initialState,
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
      })

      .addCase(fetchArtistTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = action.payload.data || [];
      })
      .addCase(fetchArtistTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.loading = false;
        if (state.tracks) {
          state.tracks = state.tracks.filter(
            (track) => track.track_id !== action.payload
          );
          state.totalTracks = state.tracks.length;
        }
        state.selectedTrack = null;
      })
      .addCase(deleteTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateTrack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrack.fulfilled, (state, action) => {
        state.loading = false;
        
        const updatedTrackIndex = state.tracks.findIndex(
          track => track.track_id === action.payload.data.id
        );
        
        if (updatedTrackIndex !== -1) {
          state.tracks[updatedTrackIndex] = {
            ...state.tracks[updatedTrackIndex],
            ...action.payload.data
          };
        }
        
        if (state.selectedTrack && state.selectedTrack.track_id === action.payload.data.id) {
          state.selectedTrack = action.payload.data;
        }
      })
      .addCase(updateTrack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const {
  setTracks,
  addTrack,
  removeTrack,
  setCurrentAlbumId,
  resetTrackState,
} = trackSlice.actions;

export default trackSlice.reducer;
