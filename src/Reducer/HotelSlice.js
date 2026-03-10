import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import api from "../Store/Api";
import { all } from "axios";


export const addHotel= createAsyncThunk(
    "addHotel",
    async (userInput, { rejectWithValue }) => {
        try {       
            const response = await api.post("/hotel/createhotel", userInput);
            console.log("response", response);
            if (response?.data?.status_code === 201) {
                return response.data;
            } else {
                return rejectWithValue("Failed to add hotel");
            }   
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message || "Something went wrong"
            );
        }
    }
);

export const updateHotel = createAsyncThunk(
  "updateHotel",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/hotel/updatehotel/${id}`, data);
      if (response?.data?.status_code === 200) {
        return response.data;
      }
      return rejectWithValue("Failed to update hotel");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteHotel = createAsyncThunk(
  "deleteHotel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/hotel/deletehotel/${id}`);
      if (response?.data?.status_code === 200) {
        return id;
      }
      return rejectWithValue("Failed to delete hotel");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const getHotelList = createAsyncThunk(
  "getHotelList",
  async (userInput, { rejectWithValue }) => {   
    try {
      const response = await api.get("/hotel/gethotel", { params: userInput });
      console.log("response", response);            
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
export const getRoomList = createAsyncThunk(
  "getRoomList",
  async (_, { rejectWithValue }) => {       
    try {
      const response = await api.get("/room/getroom");
      console.log("response", response);

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
const initialState={
    loading:false,
    error:false,  
    hotelList:[],
    hotelListData:"",
    allRoomList:[],
}
const HotelSlice=createSlice(
    {   
        name:"hotel",
        reducers:{},
        initialState,
        extraReducers:(builder)=>{
            builder
            .addCase(getHotelList.pending,(state)=>{    
                state.loading=true
            })
             .addCase(getHotelList.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.hotelList = payload.data; // 🔥 IMPORTANT   
            })
            .addCase(getHotelList.rejected,(state,{payload})=>{
                state.loading=false
                state.error=payload
        } )

        .addCase(addHotel.pending,(state)=>{
            state.loading=true
            state.error=false
        })
        .addCase(addHotel.fulfilled,(state,{payload})=>{
            state.loading=false
            state.hotelListData=payload.data
        })
        .addCase(addHotel.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })
        .addCase(getRoomList.pending,(state)=>{
            state.loading=true
            state.error=false
        })
        .addCase(getRoomList.fulfilled,(state,{payload})=>{
            state.loading=false
            state.allRoomList=payload.data
        })
        .addCase(getRoomList.rejected,(state,{payload})=>{
            state.loading=false
            state.error=payload
        })   
          .addCase(updateHotel.pending, (state) => {
            state.loading = true;
            state.error = false;
          })
          .addCase(updateHotel.fulfilled, (state, { payload }) => {
            state.loading = false;    
            const index = state.hotelList.findIndex((hotel) => hotel._id === payload.data._id);
            if (index !== -1) {
              state.hotelList[index] = payload.data;
            }
          })
          
    }
}
);


export default HotelSlice.reducer;