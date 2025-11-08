import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

// 🧩 Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      return res.data; // Expected: { page, limit, total, pages, data }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🧠 Slice definition
const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearProducts(state) {
      state.items = [];
      state.page = 1;
      state.total = 0;
      state.pages = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        const { page, limit, total, pages, data } = action.payload;
        state.items = data || [];
        state.page = page;
        state.limit = limit;
        state.total = total;
        state.pages = pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Export actions
export const { clearProducts } = productSlice.actions;

// Default export reducer (important for store.js)
export default productSlice.reducer;
