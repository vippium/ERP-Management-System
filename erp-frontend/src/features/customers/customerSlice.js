import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api.js";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async ({ page = 1, limit = 10, search = "" } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get(`/customers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
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
    clearCustomers(state) {
      state.items = [];
      state.page = 1;
      state.total = 0;
      state.pages = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        const { page, limit, total, pages, data } = action.payload;
        state.items = data || [];
        state.page = page || 1;
        state.limit = limit || state.limit;
        state.total = total || 0;
        state.pages = pages || 0;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCustomers } = customerSlice.actions;
export default customerSlice.reducer;
