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

import "./hotel.css";

const Hotels = () => {

  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const { hotelList } = useSelector((state) => state.hotel);

  useEffect(() => {
    dispatch(getHotelList());
  }, [dispatch]);

  const onSubmit = (data) => {

    if (editId) {
      dispatch(updateHotel({ id: editId, data }));
      setEditId(null);
    } else {
      dispatch(addHotel(data));
    }

    dispatch(getHotelList());

    reset();
    setShowForm(false);
  };

  const handleEdit = (hotel) => {

    setEditId(hotel._id);

    reset({
      name: hotel.name,
      location: hotel.location,
      description: hotel.description,
      amenities: hotel.amenities?.join(", ")
    });

    setShowForm(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteHotel(id));
  };

  return (
    <Dashboard>

      <div className="hotel-header">
        <h2>Hotels</h2>

        <button
          className="add-hotel-btn"
          onClick={() => setShowForm(true)}
        >
          + Add Hotel
        </button>
      </div>


      {/* FORM */}

      {showForm && (

        <form className="hotel-form" onSubmit={handleSubmit(onSubmit)}>

          <div className="form-grid">

            <div>
              <label>Hotel Name</label>
              <input {...register("name")} required />
            </div>

            <div>
              <label>Location</label>
              <input {...register("location")} required />
            </div>

            <div>
              <label>Description</label>
              <textarea {...register("description")} />
            </div>

            <div>
              <label>Amenities</label>
              <input
                placeholder="Wifi, Pool, Gym"
                {...register("amenities")}
              />
            </div>

          </div>

          <div className="form-buttons">

            <button type="submit" className="save-btn">
              {editId ? "Update Hotel" : "Add Hotel"}
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



      {/* HOTEL CARDS */}

      <div className="hotel-list">

        {hotelList?.map((hotel) => (

          <div className="hotel-card" key={hotel._id}>

            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
              alt="hotel"
              className="hotel-img"
            />

            <div className="hotel-info">

              <h3>{hotel.name}</h3>

              <p className="location">{hotel.location}</p>

              <p className="rating">⭐⭐⭐⭐⭐</p>

              <p className="amenities">
                {hotel.amenities?.join(", ")}
              </p>

              <div className="actions">

                <button
                  className="edit-btn"
                  type="button"
                  onClick={() => handleEdit(hotel)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  type="button"
                  onClick={() => handleDelete(hotel._id)}
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

export default Hotels;