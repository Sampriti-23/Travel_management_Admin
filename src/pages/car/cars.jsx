import React, { useEffect, useState } from "react";
import Dashboard from "../../layout/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  addCar,
  getCarList,
  updateCar,
  deleteCar
} from "../../Reducer/CarSlice";

import "./cars.css";

const Cars = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { carList } = useSelector((state) => state.car || { carList: [] });

  useEffect(() => {
    dispatch(getCarList());
  }, [dispatch]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("source",data.source);
    formData.append("destination", data.destination);
    formData.append("carnumber", data.carnumber);
    formData.append("price", data.price);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (editId) {
      await dispatch(updateCar({ id: editId, formData }));
      setEditId(null);
    } else {
      await dispatch(addCar(formData));
    }

    dispatch(getCarList());
    reset();
    setSelectedFile(null);
    setShowForm(false);
  };

  const handleEdit = (car) => {
    setEditId(car._id);
    reset({
      name: car.name,
      type: car.type,
      source: car.source,
      destination: car.destination,
      carnumber: car.carnumber,
      price: car.price,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteCar(id));
    dispatch(getCarList());
  };

  return (
    <Dashboard>
      <div className="car-header">
        <div>
          <p className="subtitle">FLEET MANAGEMENT</p>
          <h2>Manage Rental Vehicles</h2>
        </div>

        <button 
          className="add-car-btn" 
          onClick={() => { setEditId(null); reset(); setSelectedFile(null); setShowForm(true); }}
        >
          + Add Vehicle
        </button>
      </div>

      {/* CAR MANAGEMENT INPUT FORM */}
      {showForm && (
        <form className="car-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="form-grid">

          <div>
              <label>Source</label>
              <input {...register("source")} placeholder="location" required />
            </div>

            <div>
              <label>Destination</label>
              <input {...register("destination")} placeholder="location" required />
            </div>

            <div>
              <label>Vehicle Name / Model</label>
              <input {...register("name")} placeholder="model name" required />
            </div>

            <div>
              <label>Vehicle Type</label>
              <select {...register("type")} required>
                <option value="">Select Type</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>

            <div>
              <label>License Plate Number</label>
              <input {...register("carnumber")} placeholder="car number" required />
            </div>

            <div>
              <label>Price Per Day (₹)</label>
              <input type="number" {...register("price")} placeholder="price" required />
            </div>

            <div>
              <label>Vehicle Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              {editId ? "Update Vehicle" : "Add Vehicle"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => { setShowForm(false); reset(); setSelectedFile(null); setEditId(null); }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* DISPLAY VEHICLES INVENTORY LIST */}
      <div className="car-list">
        {carList?.map((car) => (
          <div className="car-card" key={car._id}>
            <img
              src={car.image ? `http://localhost:8000${car.image}` : "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
              alt={car.name}
              className="car-img"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"; }}
            />

            <div className="car-info">
              <span className="car-type-badge">{car.type}</span>
              <h3>{car.name}</h3>
              
              <p className="car-plate">🔢 <strong>Plate:</strong> {car.carnumber}</p>
              <p className="car-plate"><strong>Source: </strong>{car.source}</p>
              <p className="car-plate"><strong>Destination: </strong>{car.destination}</p>
              <div className="car-footer">
                <p className="price">₹ {car.price} <span>/ day</span></p>
              </div>
              

              <div className="car-actions">
                <button className="edit-btn" type="button" onClick={() => handleEdit(car)}>Edit</button>
                <button className="delete-btn" type="button" onClick={() => handleDelete(car._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Dashboard>
  );
};

export default Cars;