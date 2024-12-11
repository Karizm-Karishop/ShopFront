import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../../utilis/ToastProps";

interface wishlistData {
    user_id: number,
    product_id: number,
}
const initialwishlist: Record<string, any> = {
    items: [], // Placeholder for wishlist items
    loading: false, // To track loading state
    error: '', // To track errors
};

// Thunk to fetch wishlist by ID
export const getwishlistThunk = createAsyncThunk('wishlist/getwishlist', async (id: number, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/wishlist/${id}`);
        if (response.data) {
            return response.data.data.items;
        }
    } catch (error) {
        console.log("Error fetching wishlist:", error);
        return rejectWithValue(error || "Failed to fetch wishlist");
    }
});

// Thunk to add an item to the wishlist
export const wishlistThunk = createAsyncThunk('wishlist/addItem', async (data:wishlistData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/wishlist/add`, data);
        if (response.data) {
            console.log(response.data);
            showSuccessToast('Item added to wishlist');
            return response.data;
        }
    } catch (error) {
        showErrorToast('Failed to add item to wishlist');
        console.error("Error adding item to wishlist:", error);
        return rejectWithValue(error || "Failed to add item to wishlist");
    }
});

// wishlist Slice
export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: initialwishlist,
    reducers: {
        addTowishlist: (state, action) => {
            state.items.push(action.payload); // Add new item to the wishlist
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getwishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getwishlistThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload; // Update wishlist items
            })
            .addCase(getwishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store error
            })
            .addCase(wishlistThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(wishlistThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store error
            });
    },
});

// Export actions and reducer
export const { addTowishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
