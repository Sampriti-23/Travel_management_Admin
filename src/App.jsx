import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Hotel from "./pages/hotel/hotel";
import User from "./pages/user/user";
import Team from "./pages/team/team";
import Login from "./pages/Login/Login";
import Room from "./pages/room/Room";
import Register from "./pages/Registration/Registration";
import DestinationLocation from "./pages/location/location";
import TourPackages from "./pages/tour/tour";
import Cars from "./pages/car/cars";
import BookingAdmin from "./pages/booking/booking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hotels" element={<Hotel />} />
        <Route path="/users" element={<User/>} />
        <Route path="/team" element={<Team />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rooms" element={<Room />} />
        <Route path="/locations" element={<DestinationLocation />} />
        <Route path="/tour-packages" element={<TourPackages />} />
        <Route path="/car" element={<Cars />} />
        <Route path="/booking" element={<BookingAdmin />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
