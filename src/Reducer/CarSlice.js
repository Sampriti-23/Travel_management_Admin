import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Store/Api";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// 1. ADD CAR
export const addCar = createAsyncThunk("car/addCar", async (formData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${BASE_URL}/car/createcar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response?.data?.status_code === 201) return response.data;
    return rejectWithValue("Failed to add vehicle");
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 2. GET ALL CARS
export const getCarList = createAsyncThunk("car/getCarList", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/car/getcar");
    if (response?.data?.status_code === 200) return response.data;
    return rejectWithValue("Failed to fetch vehicles list");
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 3. UPDATE CAR
export const updateCar = createAsyncThunk("car/updateCar", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${BASE_URL}/car/updatecar/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response?.data?.status_code === 200) return response.data;
    return rejectWithValue("Failed to update vehicle data");
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

// 4. DELETE CAR
export const deleteCar = createAsyncThunk("car/deleteCar", async (id, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/car/deletecar/${id}`);
    if (response?.data?.status_code === 200) return id;
    return rejectWithValue("Failed to remove vehicle");
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const initialState = { loading: false, error: null, carList: [] };

const CarSlice = createSlice({
  name: "car",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCarList.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getCarList.fulfilled, (state, { payload }) => { state.loading = false; state.carList = payload.data; })
      .addCase(getCarList.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      .addCase(addCar.fulfilled, (state, { payload }) => { if (payload.data) state.carList.push(payload.data); })
      .addCase(updateCar.fulfilled, (state, { payload }) => {
        const index = state.carList.findIndex((car) => car._id === payload.data._id);
        if (index !== -1) state.carList[index] = payload.data;
      })
      .addCase(deleteCar.fulfilled, (state, { payload }) => {
        state.carList = state.carList.filter((car) => car._id !== payload);
      });
  }
});

export default CarSlice.reducer;