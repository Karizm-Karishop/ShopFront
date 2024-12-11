/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utilis/ToastProps';

interface ProductState {
  name: string;
  product_image: string | null;
  gallery: string[];
  shortDesc: string;
  longDesc: string;
  quantity: number;
  regular_price: number;
  sales_price: number;
  tags: string[];
  isAvailable: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  name: '',
  product_image: null,
  gallery: [],
  shortDesc: '',
  longDesc: '',
  quantity: 0,
  regular_price: 0,
  sales_price: 0,
  tags: [],
  isAvailable: true,
  loading: false,
  error: null,
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/products`;

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (
    productData: Omit<ProductState, 'loading' | 'error'>,
    { rejectWithValue }
  ) => {


    try {
      const response = await axios.post(apiUrl, productData);
      console.log(response.data)
      return response.data;
      
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);

const addProductSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setImage: (state, action: PayloadAction<string | null>) => {
      state.product_image = action.payload;
    },
    setGallery: (state, action: PayloadAction<string[]>) => {
      state.gallery = action.payload;
    },
    setShortDesc: (state, action: PayloadAction<string>) => {
      state.shortDesc = action.payload;
    },
    setLongDesc: (state, action: PayloadAction<string>) => {
      state.longDesc = action.payload;
    },

    setQuantity: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    setRegularPrice: (state, action: PayloadAction<number>) => {
      state.regular_price = action.payload;
    },
    setSalesPrice: (state, action: PayloadAction<number>) => {
      state.sales_price = action.payload;
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    setAvailability: (state, action: PayloadAction<boolean>) => {
      state.isAvailable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        showSuccessToast('Product created successfully');
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        showErrorToast(state.error);
      });
  },
});

export const {
  setName,
  setImage,
  setGallery,
  setShortDesc,
  setLongDesc,
  setQuantity,
  setRegularPrice,
  setSalesPrice,
  setTags,
  setAvailability,
} = addProductSlice.actions;

export default addProductSlice.reducer;
