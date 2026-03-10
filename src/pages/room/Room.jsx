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

  const { roomList } = useSelector((state) => state.room);
  const { hotelList } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(getRoomList());
    dispatch(getHotelList());
  }, [dispatch]);

  const onSubmit = (data) => {

    if (editId) {
      dispatch(updateRoom({ id: editId, data }));
      setEditId(null);
    } else {
      dispatch(addRoom(data));
    }

    dispatch(getRoomList());

    reset();
    setShowForm(false);
  };

  const handleEdit = (room) => {

    setEditId(room._id);

    reset({
      hotel: room.hotel?._id,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      available: room.available
    });

    setShowForm(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteRoom(id));
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
          onClick={() => setShowForm(true)}
        >
          + Add Room
        </button>

      </div>


      {/* ADD ROOM FORM */}

      {showForm && (

        <form className="room-form" onSubmit={handleSubmit(onSubmit)}>

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

          </div>

          <div className="form-buttons">

            <button type="submit" className="save-btn">
              {editId ? "Update Room" : "Add Room"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

          </div>

        </form>

      )}



      {/* ROOM CARDS */}

      <div className="room-list">

        {roomList?.map((room) => (

          <div className="room-card" key={room._id}>

            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427"
              alt="room"
              className="room-img"
            />

            <div className="room-info">

              <h3>{room.roomType}</h3>

              <p className="hotel-name">
                {room.hotel?.name}
              </p>

              <p className="price">
                ₹ {room.pricePerNight} / night
              </p>

              <p className="details">
                {room.capacity} guests
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