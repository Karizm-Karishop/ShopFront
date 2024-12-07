/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utilis/ToastProps";
import { store } from "../store";


interface Book {
  id: number;
  bookName: string;
  bookTitle: string;
  authorFirstName: string;
  authorLastName: string;
  coverImage?: string;
  uploadFile?: string;
  price: number;
  yearOfPublish: number;
  publishedDate?: string;
  pageNumber: number;
  description?: string;
  artist_id?: number;
}

interface BookState {
  books: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  loading: false,
  error: null,
};

const apiUrl = `${import.meta.env.VITE_BASE_URL}/books`;

export const fetchAllbooks = createAsyncThunk(
  "book/fetchAllbooks",
  async (rejectWithValue: any) => {
    const token = localStorage.getItem("token");
    const user = store.getState().loginIn.user;

    const artist_id = user?.user_id;
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/books/user/${artist_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("book Data", response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch books";
      showErrorToast(errorMessage);

      return rejectWithValue(errorMessage);
    }
  }
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData: any, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const user = store.getState().loginIn.user;
    console.log("User Display", user);
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const bookPayload = {
        bookName: bookData.bookName,
        bookTitle: bookData.bookTitle,
        authorFirstName: bookData.authorFirstName,
        authorLastName: bookData.authorLastName,
        yearOfPublish: bookData.yearOfPublish,
        pageNumber: bookData.pageNumber,
        price: bookData.price,
        artist: Number(user?.user_id),
        publishedDate: bookData.publishedDate || null,
        coverImage: bookData.coverImage || null,
        uploadFile: bookData.uploadFile || null,
        description: bookData.description || null,
      };

      const response = await axios.post(apiUrl, bookPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast("Book created successfully!");
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create book";
      showErrorToast(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBook = createAsyncThunk(
  "book/deleteBook",
  async (bookId: number, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      await axios.delete(`${apiUrl}/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast("Book deleted successfully");

      return bookId;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete Book";
      showErrorToast(errorMessage);

      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBook = createAsyncThunk(
  "book/updateBook",
  async (
    bookData: {
      id: number;
      bookName?: string;
      bookTitle?: string;
      authorFirstName?: string;
      authorLastName?: string;
      yearOfPublish?: number;
      pageNumber?: number;
      price?: number;
      publishedDate?: string;
      coverImage?: File | string | null;
      uploadFile?: File | string | null;
      description?: string;
    },
    { rejectWithValue }
  ) => {
    const token = localStorage.getItem("token");
    const user = store.getState().loginIn.user;

    if (!token) {
      return rejectWithValue("No token found");
    }

    try {
      const bookPayload = {
        bookName: bookData.bookName,
        bookTitle: bookData.bookTitle,
        authorFirstName: bookData.authorFirstName,
        authorLastName: bookData.authorLastName,
        yearOfPublish: bookData.yearOfPublish,
        pageNumber: bookData.pageNumber,
        price: bookData.price,
        artist: Number(user?.user_id),
        publishedDate: bookData.publishedDate || null,
        coverImage: bookData.coverImage || null,
        uploadFile: bookData.uploadFile || null,
        description: bookData.description || null,
      };

      Object.keys(bookPayload).forEach(
        (key) =>
          bookPayload[key as keyof typeof bookPayload] === undefined &&
          delete bookPayload[key as keyof typeof bookPayload]
      );

      const response = await axios.put(
        `${apiUrl}/${bookData.id}`,
        bookPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccessToast("Book updated successfully");

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to update book";
      showErrorToast(errorMessage);

      return rejectWithValue(errorMessage);
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    setBooks: (state, action: PayloadAction<Book[]>) => {
      state.books = action.payload;
    },
    resetBookState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllbooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllbooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.data.books;
      })
      .addCase(fetchAllbooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books = state.books.filter((book) => book.id !== action.payload);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex(
          (book) => book.id === action.payload.data.id
        );
        if (index !== -1) {
          state.books[index] = action.payload.data;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setBooks, resetBookState } = bookSlice.actions;

export default bookSlice.reducer;
