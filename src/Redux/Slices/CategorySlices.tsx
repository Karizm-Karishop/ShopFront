/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../../utilis/ToastProps';

export interface  Category {
  category_id: number;
  totalDownloads: number;
  id: number;
  category_name: string;
  description: string;
  category_icon: File | null;
  created_at: Date;
  updated_at: Date;
  tracks?: any[];
}

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  category_name: string;
  description: string;
  category_icon: File | null;
  loading: boolean;
  error: string | null;
  totalCategories: number;
}

const initialState: CategoryState = {
    categories: [],
  selectedCategory: null,
  category_name: '',
  description: '',
  category_icon:  null,
  loading: false,
  error: null,
  totalCategories: 0,
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/categories`;

export const fetchAllCategoriesByArtist = createAsyncThunk(
  'category/fetchAllCategories',
  async (artist_id: number, { rejectWithValue }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/categories/${artist_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Category Data",response.data)
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch categories';
      showErrorToast(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const createcategory = createAsyncThunk(
  'category/createcategory',
  async (
    categoryData: { 
        category_name: string;
        description: string;
        category_icon: File | null;
        artist_id: number
    }, 
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const formData = new FormData();
      formData.append('category_name', categoryData.category_name);
      formData.append('artist_id', categoryData.artist_id.toString()); 
      if (categoryData.description) {
        formData.append('description', categoryData.description);
      }
      
      if (categoryData.category_icon) {
        formData.append('category_icon', categoryData.category_icon);
      }

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast('Category created successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create Category';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


export const deletecategory = createAsyncThunk(
  'category/deletecategory',
  async (categoryId: number, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
       await axios.delete(`${apiUrl}/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast('category deleted successfully');
      
      return categoryId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      showErrorToast(errorMessage);
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const updatecategory = createAsyncThunk(
  'category/updatecategory',
  async (
    categoryData: { 
      id: number;
      category_name?: string; 
      description?: string; 
      category_icon?: File | null;
    }, 
    { rejectWithValue }
  ) => {
    if (!categoryData.id) {
      return rejectWithValue('Category ID is required');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const formData = new FormData();
      if (categoryData.category_name) {
        formData.append('category_name', categoryData.category_name);
      }
      if (categoryData.description) {
        formData.append('description', categoryData.description);
      }
      if (categoryData.category_icon) {
        formData.append('category_icon', categoryData.category_icon);
      }
      
      const response = await axios.put(`${apiUrl}/${categoryData.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      showSuccessToast('Category updated successfully');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.category_name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setCategoryIcon: (state, action: PayloadAction<File | null>) => {
      state.category_icon = action.payload;
    },

    resetcategoryState: () => initialState
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllCategoriesByArtist.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllCategoriesByArtist.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload.data.categories;
      state.totalCategories = action.payload.data.categories.length;
    })
    .addCase(fetchAllCategoriesByArtist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    })
      
      .addCase(createcategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createcategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload.data);
        state.totalCategories += 1;
      })
      .addCase(createcategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(deletecategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletecategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(category => category.id !== action.payload);
        state.totalCategories -= 1;
      })
      
      .addCase(deletecategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatecategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatecategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = action.payload.data;
        const index = state.categories.findIndex(category => category.id === updatedCategory.id);
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      .addCase(updatecategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    

      
  },
});

export const {
  setName,
  setDescription,
  setCategoryIcon,
  resetcategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;