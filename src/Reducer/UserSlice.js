import {createAsyncThunk,createSlice} from "@reduxjs/toolkit";
import api from "../Store/Api";
import axios from"axios";

const BASE_URL ="http://localhost:8000/api";

//getalluser

export const getalluser =createAsyncThunk("userData/getalluser",async(_,{rejectWithValue})=>{
    try{
        const response =await api.get("/user/getalluser");    
        if(response?.data?.status_code === 200) 
             return response?.data;
        else{
               return rejectWithValue("Failed to fetch users list");
        }
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
const initialState = {
     loading: false, 
    error: null,
    userList:[]

};
const UserSlice = createSlice({
    name:"userData",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getalluser.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(getalluser.fulfilled,(state,{payload})=>{
            state.loading = false;
            state.userList = payload;
            console.log("payload",payload);
            
        })
        .addCase(getalluser.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload || "Failed to fetch users list";
        })
    }
});

export default UserSlice.reducer;