import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Store/Api";
import axios from "axios"; // ✅ Import standard axios here

// Update this base URL string to match your exact backend port
const BASE_URL = "http://localhost:8000/api"; 

export const addHotel = createAsyncThunk(
  "addHotel",
  async (userInput, { rejectWithValue }) => {
    try {
      // ✅ Use clean vanilla axios to bypass any global JSON interceptors
      const response = await axios.post(
        `${BASE_URL}/hotel/createhotel`,
        userInput, // This must be the raw FormData instance from Hotels.jsx
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status_code === 201) {
        return response.data;
      }

      return rejectWithValue("Failed to add hotel");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

export const updateHotel = createAsyncThunk(
  "updateHotel",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // ✅ Use clean vanilla axios here too
      const response = await axios.put(
        `${BASE_URL}/hotel/updatehotel/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.status_code === 200) {
        return response.data;
      }

      return rejectWithValue("Failed to update hotel");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 3. DELETE HOTEL
export const deleteHotel = createAsyncThunk(
  "deleteHotel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hotel/deletehotel/${id}`);
      if (response?.data?.status_code === 200) {
        return id; // Returns the database string ID to filter locally out of state array
      }
      return rejectWithValue("Failed to delete hotel");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 4. GET HOTELS LIST
export const getHotelList = createAsyncThunk(
  "getHotelList",
  async (userInput, { rejectWithValue }) => {
    try {
      const response = await api.get("/hotel/gethotel", { params: userInput });
      if (response?.data?.status_code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.data || "Failed to fetch hotel list");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

// 5. GET ROOMS LIST
export const getRoomList = createAsyncThunk(
  "getRoomList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/room/getroom");

      if (response?.data?.status_code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.data || "Failed to fetch room list");
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Something went wrong"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  hotelList: [],
  hotelListData: "",
  allRoomList: [],
};

const HotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET HOTEL LIST lifecycle
      .addCase(getHotelList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHotelList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.hotelList = payload.data;
      })
      .addCase(getHotelList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // ADD HOTEL lifecycle
      .addCase(addHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHotel.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.hotelListData = payload.data;
        // Optional: Directly push the newly created item into the active UI view array
        if (payload.data) {
          state.hotelList.push(payload.data);
        }
      })
      .addCase(addHotel.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // GET ROOM LIST lifecycle
      .addCase(getRoomList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoomList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.allRoomList = payload.data;
      })
      .addCase(getRoomList.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // UPDATE HOTEL lifecycle
      .addCase(updateHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, { payload }) => {
        state.loading = false;
        const index = state.hotelList.findIndex(
          (hotel) => hotel._id === payload.data._id
        );
        if (index !== -1) {
          state.hotelList[index] = payload.data;
        }
      })
      .addCase(updateHotel.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // ✅ ADDED: DELETE HOTEL lifecycle handlers
      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, { payload }) => {
        state.loading = false;
        // Instantly filters the deleted hotel out of the UI without an extra server call
        state.hotelList = state.hotelList.filter(
          (hotel) => hotel._id !== payload
        );
      })
      .addCase(deleteHotel.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export default HotelSlice.reducer;