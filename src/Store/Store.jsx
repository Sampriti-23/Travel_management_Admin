import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "../Reducer/AuthSlice";
import HotelSlice from "../Reducer/HotelSlice";
import RoomSlice from "../Reducer/RoomSlice";
import destinationReducer from "../Reducer/DestinationSlice";
import locationReducer from "../Reducer/LocationSlice";
import tourReducer from "../Reducer/TourSlice";
import carReducer from "../Reducer/CarSlice";
import user from "../Reducer/UserSlice";
const Store = configureStore(
    {
        reducer:{
            auth:AuthSlice,
            hotel:HotelSlice,
            room:RoomSlice,
            destination: destinationReducer,
            location: locationReducer,
            tourPackage: tourReducer,
            car: carReducer,
            userData:user

        }
    }
)
export default Store;