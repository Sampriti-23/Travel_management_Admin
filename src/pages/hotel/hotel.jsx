import React, { useEffect, useState } from "react";
import Dashboard from "../../layout/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import {
  addHotel,
  getHotelList,
  updateHotel,
  deleteHotel,
} from "../../Reducer/HotelSlice";

import { getDestinationList } from "../../Reducer/DestinationSlice";
import { getLocationByDestination } from "../../Reducer/LocationSlice";

import "./hotel.css";

const Hotels = () => {
  const BASE_URL = "http://localhost:8000";
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ Track image file

  const { hotelList } = useSelector((state) => state.hotel);
  const { destinationList } = useSelector((state) => state.destination);
  const { locationList } = useSelector((state) => state.location);

  useEffect(() => {
    dispatch(getHotelList());
    dispatch(getDestinationList());
  }, [dispatch]);

  const handleDestinationChange = (e) => {
    const destinationId = e.target.value;
    if (destinationId) {
      dispatch(getLocationByDestination(destinationId));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); // ✅ Capture file object
  };

  const onSubmit = async (data) => {
  // 🔥 1. CHECK THIS LOG IN YOUR BROWSER CONSOLE
  console.log("📝 RAW FORM DATA BEFORE SENDING:", data);

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("destination", data.destination);
  formData.append("location", data.location);
  formData.append("description", data.description || "");
  formData.append("amenities", data.amenities || "");

 if (selectedFile) {
    formData.append("image", selectedFile); 
  }

  // 🔥 2. CHECK THIS LOG TO CONFIRM FORM DATA CONTENT
  console.log("📦 FORM DATA ENTRIES:");
  for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

  if (editId) {
    await dispatch(updateHotel({ id: editId, formData }));
    setEditId(null);
  } else {
    await dispatch(addHotel(formData));
  }

  dispatch(getHotelList());
  reset();
  setSelectedFile(null);
  setShowForm(false);
};
  const handleEdit = (hotel) => {
    setEditId(hotel._id);

    reset({
      name: hotel.name,
      destination: hotel.destination?._id || hotel.destination,
      location: hotel.location?._id || hotel.location,
      description: hotel.description,
      amenities: hotel.amenities?.join(", "),
    });

    const destId = hotel.destination?._id || hotel.destination;
    if (destId) {
      dispatch(getLocationByDestination(destId));
    }

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteHotel(id));
    dispatch(getHotelList());
  };

  return (
    <Dashboard>
      <div className="hotel-header">
        <h2>Hotels</h2>
        <button className="add-hotel-btn" onClick={() => setShowForm(true)}>
          + Add Hotel
        </button>
      </div>

      {showForm && (
        <form className="hotel-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="form-grid">
            <div>
              <label>Hotel Name</label>
              <input {...register("name")} required />
            </div>

            <div>
              <label>Destination</label>
              <select
                {...register("destination", {
                  onChange: handleDestinationChange,
                })}
                required
              >
                <option value="">Select Destination</option>
                {destinationList?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Location</label>
              <select {...register("location")} required>
                <option value="">Select Location</option>
                {locationList?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Description</label>
              <textarea {...register("description")}></textarea> 
            </div>

            <div>
              <label>Amenities</label>
              <input placeholder="Wifi, Pool, Gym" {...register("amenities")} />
            </div>

            {/* ✅ New Image Input Field */}
            <div>
              <label>Hotel Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              {editId ? "Update Hotel" : "Add Hotel"}
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

      <div className="hotel-list">
        {hotelList?.map((hotel) => (
          <div className="hotel-card" key={hotel._id}>
            {/* ✅ Dynamic Image URL targeting backend server */}
            <img
              src={hotel.image ? `${BASE_URL}${hotel.image}` : "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
              alt={hotel.name}
              className="hotel-img"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945"; // Fallback image if local upload breaks
              }}
            />

            <div className="hotel-info">
              <h3>{hotel.name}</h3>
              <p className="location">📍 {hotel.location?.name || "No Location Specified"}</p>
              <p className="destination">🌍 {hotel.destination?.name || "No Destination Specified"}</p>
              <p className="rating">⭐⭐⭐⭐⭐</p>
              <p className="amenities">{hotel.amenities?.join(", ")}</p>

              <div className="actions">
                <button className="edit-btn" type="button" onClick={() => handleEdit(hotel)}>
                  Edit
                </button>
                <button className="delete-btn" type="button" onClick={() => handleDelete(hotel._id)}>
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

export default Hotels;