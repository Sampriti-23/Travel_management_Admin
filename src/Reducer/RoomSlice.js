import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Store/Api";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// 1. ADD ROOM (Accepts FormData payload)
export const addRoom = createAsyncThunk(
  "addRoom",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/room/createroom`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data?.status_code === 201) return response.data;
      return rejectWithValue("Failed to add room");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. UPDATE ROOM (Accepts id and FormData payload)
export const updateRoom = createAsyncThunk(
  "updateRoom",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/room/updateroom/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data?.status_code === 200) return response.data;
      return rejectWithValue("Failed to update room");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. DELETE ROOM
export const deleteRoom = createAsyncThunk(
  "deleteRoom",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/room/deleteroom/${id}`);
      if (response?.data?.status_code === 200) return id;
      return rejectWithValue("Failed to delete room");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4. GET ROOM LIST
export const getRoomList = createAsyncThunk(
  "getRoomList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/room/getroom");
      if (response?.data?.status_code === 200) return response.data;
      return rejectWithValue("Failed to fetch rooms");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  roomList: [],
};

const RoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET ROOMS LIST
      .addCase(getRoomList.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(getRoomList.fulfilled, (state, { payload }) => { state.loading = false; state.roomList = payload.data; })
      .addCase(getRoomList.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      // ADD ROOM
      .addCase(addRoom.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addRoom.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.data) state.roomList.push(payload.data);
      })
      .addCase(addRoom.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      // UPDATE ROOM
      .addCase(updateRoom.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateRoom.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.roomList.findIndex((room) => room._id === payload.data._id);
        if (index !== -1) state.roomList[index] = payload.data;
      })
      .addCase(updateRoom.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

      // DELETE ROOM
      .addCase(deleteRoom.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteRoom.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.roomList = state.roomList.filter((room) => room._id !== payload);
      })
      .addCase(deleteRoom.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export default RoomSlice.reducer;