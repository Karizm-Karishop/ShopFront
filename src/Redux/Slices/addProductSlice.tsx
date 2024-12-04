/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utilis/ToastProps';
import { RootState } from '../store';
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
  artist_id?: number;
  loading: boolean;
  error: string | null;
  totalAlbums: number; 
  products?: any[];
  totalProducts: number;
  selectedProduct?: any;
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
  totalAlbums: 0,
  products: [],
  totalProducts: 0, 
};


const apiUrl = `${import.meta.env.VITE_BASE_URL}/products`;

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (
    productData: Omit<ProductState, 'loading' | 'error'>,
    { rejectWithValue,getState }
  ) => {
    const state = getState() as RootState;
    const user = state.loginIn.user;

    const productWithArtistId = {
      ...productData,
      artist_id: user?.user_id, 
    };
    try {
      const response = await axios.post(apiUrl, productWithArtistId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create product'
      );
    }
  }
);


export const fetchAllProductswithArtist = createAsyncThunk(
  'product/fetchAllproducts',
  async (artist_id: number, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products/artist/${artist_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Product Data",response.data)
      return response.data;
    } catch (error: any) {
      const errorMessage = 'No Product Found For this Artist';      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/updateProduct',
  async (
    { productId, productData }: { productId: number; productData: Partial<ProductState> }, 
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.put(`${apiUrl}/${productId}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      showSuccessToast('Product updated successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Delete Product Thunk
export const deleteProduct = createAsyncThunk(
  'product/deleteProduct',
  async (productId: number, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.delete(`${apiUrl}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Deleted Data",response)
      
      showSuccessToast('Product deleted successfully');
      return productId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
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
    setSelectedProduct: (state, action: PayloadAction<any>) => {
      state.selectedProduct = action.payload;
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
      })

      .addCase(fetchAllProductswithArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductswithArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data.products;
        state.totalProducts = action.payload.data.products.length;
      })
      .addCase(fetchAllProductswithArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the product in the list
        if (state.products) {
          const index = state.products.findIndex(
            (product) => product.product_id === action.payload.data.product_id
          );
          if (index !== -1) {
            state.products[index] = action.payload.data;
          }
        }
        state.selectedProduct = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Product Reducers
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted product from the list
        if (state.products) {
          state.products = state.products.filter(
            (product) => product.product_id !== action.payload
          );
          state.totalProducts = state.products.length;
        }
        state.selectedProduct = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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
  setSelectedProduct
} = addProductSlice.actions;

export default addProductSlice.reducer;
