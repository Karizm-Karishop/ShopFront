import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
type Category={
    category_name: string,
    category_id: number,
}
const Initialcategory:Category={
    category_id:1,
    category_name:'Fashion',
}
export const categoryThunk= createAsyncThunk('categories/fetch', 
    async()=>{
        const response= await axios.get(`${import.meta.env.VITE_BASE_URL}/categories`);
        if(response.status === 200){
            console.log(response.data.data.categories);
            return response.data.data.categories;
            
        }
    }
)
const categorySlice= createSlice({
    name:'categoryies',
    initialState: {
        categories:[Initialcategory],
        loading: false,
        error: null,
    },
    reducers: {
        setCategories(state){
            state.categories
        }   
    },
    extraReducers: (builder)=>{
        builder
       .addCase(categoryThunk.fulfilled, (state,action)=>{
         state.loading=false;
         state.categories=action.payload;
       }).addCase(categoryThunk.rejected, (state,action)=>{
         state.loading=false;
         state.error=action?.error.message as any;
       })
    }
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
