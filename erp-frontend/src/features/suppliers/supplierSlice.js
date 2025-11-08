import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const fetchSuppliers = createAsyncThunk(
  "suppliers/fetchSuppliers",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(`/suppliers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const supplierSlice = createSlice({
  name: "suppliers",
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
    clearSuppliers(state) {
      state.items = [];
      state.page = 1;
      state.total = 0;
      state.pages = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        const { page, limit, total, pages, data } = action.payload;
        state.items = data || [];
        state.page = page || 1;
        state.limit = limit || state.limit;
        state.total = total || 0;
        state.pages = pages || 0;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSuppliers } = supplierSlice.actions;
export default supplierSlice.reducer;
