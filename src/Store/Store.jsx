import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../Reducer/AuthSlice";
import HotelSlice from "../Reducer/HotelSlice";
import RoomSlice from "../Reducer/RoomSlice";
const Store = configureStore(
    {
        reducer:{
            auth:AuthSlice,
            hotel:HotelSlice,
            room:RoomSlice,
        }
    }
)
export default Store;