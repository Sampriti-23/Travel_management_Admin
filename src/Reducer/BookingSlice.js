import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Store/Api";
import axios from "axios";
const BASE_URL = "http://localhost:8000/api";

// 1. ADD BOOKING
export const addBooking = createAsyncThunk("booking/addBooking", async (FormData, { rejectWithValue}) =>{
    try {
        const response = await axios.post(`${BASE_URL}/booking/createbooking`, FormData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
        if (response?.data?.status_code === 201) return response.data; 
        return rejectWithValue("Failed to add booking");
}
    catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// 2. GET ALL BOOKINGS
export const getBookingList = createAsyncThunk("booking.getBookingList", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("/booking/getbooking");
        if (response?.data?.status_code === 200) return response.data;
        return rejectWithValue("Failed to fetch booking list");
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// 3. UPDATE BOOKING
export const updateBooking = createAsyncThunk("booking/updateBooking", async ({ id, FormData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${BASE_URL}/booking/updatebooking/${id}`, FormData, {
            headers: {"Content-Type": "multipart/form-data"}
        });
        if (response?.data?.status_code === 200) return response.data;
        return rejectWithValue("Failed to update booking data");
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// 4. DELETE BOOKING
export const deleteBooking = createAsyncThunk("booking/deleteBooking", async (id, { rejectWithValue }) => {
    try {
        const response = await api.delete(`/booking/deletebooking/${id}`);
        if (response?.data?.status_code === 200) return id;
        return rejectWithValue("Failed to remove booking");
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const initialState = { loading: false, error: null, bookingList: [] };

const BookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBooking.fulfilled, (state, { payload }) => {
                state.loading = false;
                if (payload.data) state.bookingList.push(payload.data);
            })
            .addCase(addBooking.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            .addCase(getBookingList.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(getBookingList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.bookingList = payload.data;
            }
            )
            .addCase(getBookingList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }
            )
            .addCase(updateBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            } 
            )
            .addCase(updateBooking.fulfilled, (state, { payload }) => {
                state.loading = false;
                const index = state.bookingList.findIndex((booking) => booking._id === payload.data.id);
                if (index !== -1) state.bookingList[index] = payload.data;
            }
            )
            .addCase(updateBooking.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }
            )
            .addCase(deleteBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBooking.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.bookingList = state.bookingList.filter((booking) => booking._id !== payload);
            })
            .addCase(deleteBooking.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
});

export default BookingSlice.reducer;    