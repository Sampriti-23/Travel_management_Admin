import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Store/Api";
import axios from "axios";

// Update this base URL to match your backend port configuration
const BASE_URL = "http://localhost:8000/api";

// 1. CREATE TOUR PACKAGE (Accepts FormData)
export const addTourPackage = createAsyncThunk(
  "tourPackage/addTourPackage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/tourpackage/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.status_code === 201) {
        return response.data;
      }
      return rejectWithValue("Failed to create tour package");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

// 2. GET ALL TOUR PACKAGES
export const getTourPackageList = createAsyncThunk(
  "tourPackage/getTourPackageList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/tourpackage/getall");
      if (response?.data?.status_code === 200) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch tour packages");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

// 3. UPDATE TOUR PACKAGE (Accepts { id, formData })
export const updateTourPackage = createAsyncThunk(
  "tourPackage/updateTourPackage",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/tourpackage/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.data?.status_code === 200) {
        return response.data;
      }
      return rejectWithValue("Failed to update tour package");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

// 4. DELETE TOUR PACKAGE
export const deleteTourPackage = createAsyncThunk(
  "tourPackage/deleteTourPackage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/tourpackage/delete/${id}`);
      if (response?.data?.status_code === 200) {
        return id; // Return the ID so we can remove it from state locally
      }
      return rejectWithValue("Failed to delete tour package");
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  tourList: [],
  currentPackage: null,
};

const TourPackageSlice = createSlice({
  name: "tourPackage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- GET ALL TOUR PACKAGES ---
      .addCase(getTourPackageList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTourPackageList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tourList = payload.data;
      })
      .addCase(getTourPackageList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // --- CREATE TOUR PACKAGE ---
      .addCase(addTourPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTourPackage.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.data) {
          state.tourList.push(payload.data); // Update UI array immediately
        }
      })
      .addCase(addTourPackage.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // --- UPDATE TOUR PACKAGE ---
      .addCase(updateTourPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTourPackage.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.tourList.findIndex(
          (pkg) => pkg._id === payload.data._id
        );
        if (index !== -1) {
          state.tourList[index] = payload.data; // Replace with updated data object
        }
      })
      .addCase(updateTourPackage.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // --- DELETE TOUR PACKAGE ---
      .addCase(deleteTourPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTourPackage.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.tourList = state.tourList.filter((pkg) => pkg._id !== payload);
      })
      .addCase(deleteTourPackage.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default TourPackageSlice.reducer;