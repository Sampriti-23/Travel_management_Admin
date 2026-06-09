import React, { useEffect, useState } from "react";
import Dashboard from "../../layout/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  addRoom,
  getRoomList,
  updateRoom,
  deleteRoom
} from "../../Reducer/RoomSlice";

import { getHotelList } from "../../Reducer/HotelSlice";

import "./room.css";

const Rooms = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ Tracks file payload state

  const { roomList } = useSelector((state) => state.room);
  const { hotelList } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(getRoomList());
    dispatch(getHotelList());
  }, [dispatch]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // ✅ Capture file resource info safely
  };

  const onSubmit = async (data) => {
    // ✅ Reconstruct payload into a FormData object
    const formData = new FormData();
    formData.append("hotel", data.hotel);
    formData.append("roomType", data.roomType);
    formData.append("pricePerNight", data.pricePerNight);
    formData.append("capacity", data.capacity);
    formData.append("available", data.available);

    // ✅ Append file data if one was uploaded
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (editId) {
      // ✅ Matches thunk expected argument pattern ({ id, formData })
      await dispatch(updateRoom({ id: editId, formData }));
      setEditId(null);
    } else {
      await dispatch(addRoom(formData));
    }

    dispatch(getRoomList());

    reset();
    setSelectedFile(null); // Clear active file pointer memory
    setShowForm(false);
  };

  const handleEdit = (room) => {
    setEditId(room._id);

    reset({
      hotel: room.hotel?._id || room.hotel, // Keep string identification mapping target
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      available: String(room.available) // Maps easily to choice input strings
    });

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteRoom(id));
    dispatch(getRoomList());
  };

  return (
    <Dashboard>
      <div className="room-header">
        <div>
          <p className="subtitle">ROOMS & SUITES</p>
          <h2>Comfortable Rooms Just For You</h2>
        </div>

        <button
          className="add-room-btn"
          onClick={() => {
            setEditId(null);
            reset();
            setSelectedFile(null);
            setShowForm(true);
          }}
        >
          + Add Room
        </button>
      </div>

      {/* ADD / UPDATE ROOM FORM */}
      {showForm && (
        <form className="room-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="form-grid">
            <div>
              <label>Hotel</label>
              <select {...register("hotel")} required>
                <option value="">Select Hotel</option>
                {hotelList?.map((hotel) => (
                  <option key={hotel._id} value={hotel._id}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Room Type</label>
              <input
                {...register("roomType")}
                placeholder="Deluxe Room"
                required
              />
            </div>

            <div>
              <label>Price Per Night</label>
              <input
                type="number"
                {...register("pricePerNight")}
                required
              />
            </div>

            <div>
              <label>Capacity</label>
              <input
                type="number"
                {...register("capacity")}
                required
              />
            </div>

            <div>
              <label>Available</label>
              <select {...register("available")}>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            {/* ✅ Added Image File Upload Input Field Component Element */}
            <div>
              <label>Room Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              {editId ? "Update Room" : "Add Room"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowForm(false);
                reset();
                setSelectedFile(null);
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ROOM CARDS LIST SUMMARY */}
      <div className="room-list">
        {roomList?.map((room) => (
          <div className="room-card" key={room._id}>
            {/* ✅ Handles dynamic rendering targets to localhost express asset folder strings */}
            <img
              src={room.image ? `http://localhost:8000${room.image}` : "https://images.unsplash.com/photo-1590490360182-c33d57733427"}
              alt={room.roomType}
              className="room-img"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1590490360182-c33d57733427"; // Clean layout crash protection fallback image logic
              }}
            />

            <div className="room-info">
              <h3>{room.roomType}</h3>
              <p className="hotel-name">🏢 {room.hotel?.name || "Independent Room"}</p>
              <p className="price">₹ {room.pricePerNight} / night</p>
              <p className="details">👤 Max: {room.capacity} Guests</p>
              
              {/* Dynamic availability badge style indicator helper context option */}
              <p className={`status ${room.available ? "avail" : "unavail"}`}>
                {room.available ? "🟢 Open Booking" : "🔴 Fully Reserved"}
              </p>

              <div className="room-actions">
                <button
                  className="edit-btn"
                  type="button"
                  onClick={() => handleEdit(room)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  type="button"
                  onClick={() => handleDelete(room._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Dashboard>
  );
};

export default Rooms;