import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../../utilis/ToastProps";

interface CartData {
    user_id: number,
    product_id: number,
    quantity: number
}
const initialCart: Record<string, any> = {
    items: [], // Placeholder for cart items
    loading: false, // To track loading state
    error: '', // To track errors
};

// Thunk to fetch cart by ID
export const getCartThunk = createAsyncThunk('cart/getCart', async (id: number, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/cart/${id}`);
        if (response.data) {
            return response.data.data.items;
        }
    } catch (error) {
        console.log("Error fetching cart:", error);
        return rejectWithValue(error || "Failed to fetch cart");
    }
});

// Thunk to add an item to the cart
export const cartThunk = createAsyncThunk('cart/addItem', async (data:CartData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/cart/add`, data);
        if (response.data) {
            console.log(response.data);
            showSuccessToast('Item added to cart');
            return response.data;
        }
    } catch (error) {
        showErrorToast('Failed to add item to cart');
        console.error("Error adding item to cart:", error);
        return rejectWithValue(error || "Failed to add item to cart");
    }
});

// Cart Slice
export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCart,
    reducers: {
        addToCart: (state, action) => {
            state.items.push(action.payload); // Add new item to the cart
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCartThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload; // Update cart items
            })
            .addCase(getCartThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store error
            })
            .addCase(cartThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cartThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Store error
            });
    },
});

// Export actions and reducer
export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
