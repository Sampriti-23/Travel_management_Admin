import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Store/Api";


/* ========================
   ADD ROOM
======================== */

export const addRoom = createAsyncThunk(
  "addRoom",
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.post("/room/createroom", userInput);

      if (response?.data?.status_code === 201) {
        return response.data;
      } else {
        return rejectWithValue("Failed to add room");
      }

    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);



/* ========================
   GET ROOM LIST
======================== */

export const getRoomList = createAsyncThunk(
  "getRoomList",
  async (_, { rejectWithValue }) => {
    try {

      const response = await api.get("/room/getroom");

      if (response?.data?.status_code === 200) {
        return response.data;
      } else {
        return rejectWithValue("Failed to fetch rooms");
      }

    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);



/* ========================
   UPDATE ROOM
======================== */

export const updateRoom = createAsyncThunk(
  "updateRoom",
  async ({ id, data }, { rejectWithValue }) => {
    try {

      const response = await api.put(`/room/updateroom/${id}`, data);

      if (response?.data?.status_code === 200) {
        return response.data;
      }

      return rejectWithValue("Failed to update room");

    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);



/* ========================
   DELETE ROOM
======================== */

export const deleteRoom = createAsyncThunk(
  "deleteRoom",
  async (id, { rejectWithValue }) => {
    try {

      const response = await api.delete(`/room/deleteroom/${id}`);

      if (response?.data?.status_code === 200) {
        return id;
      }

      return rejectWithValue("Failed to delete room");

    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);



/* ========================
   INITIAL STATE
======================== */

const initialState = {
  loading: false,
  error: false,
  roomList: [],
  roomListData: ""
};



/* ========================
   ROOM SLICE
======================== */

const RoomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    builder


      /* GET ROOM LIST */

      .addCase(getRoomList.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(getRoomList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.roomList = payload.data;
      })

      .addCase(getRoomList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })



      /* ADD ROOM */

      .addCase(addRoom.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(addRoom.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.roomListData = payload.data;
      })

      .addCase(addRoom.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })



      /* UPDATE ROOM */

      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(updateRoom.fulfilled, (state, { payload }) => {
        state.loading = false;

        const index = state.roomList.findIndex(
          (room) => room._id === payload.data._id
        );

        if (index !== -1) {
          state.roomList[index] = payload.data;
        }

      })

      .addCase(updateRoom.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })



      /* DELETE ROOM */

      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = false;
      })

      .addCase(deleteRoom.fulfilled, (state, { payload }) => {
        state.loading = false;

        state.roomList = state.roomList.filter(
          (room) => room._id !== payload
        );

      })

      .addCase(deleteRoom.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

  }
});


export default RoomSlice.reducer;