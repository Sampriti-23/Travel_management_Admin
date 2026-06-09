import React, { useEffect, useState } from "react";
import Dashboard from "../../layout/Dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

// Update these import paths according to your actual folder layout
import {
  addTourPackage,
  getTourPackageList,
  updateTourPackage,
  deleteTourPackage,
} from "../../Reducer/TourSlice"; 
import { getDestinationList } from "../../Reducer/DestinationSlice";
import { getLocationByDestination } from "../../Reducer/LocationSlice";

import "./tour.css"; // Ensure you create a matching CSS file

const TourPackages = () => {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { tourList } = useSelector((state) => state.tourPackage || { tourList: [] });
  const { destinationList } = useSelector((state) => state.destination);
  const { locationList } = useSelector((state) => state.location);

  useEffect(() => {
    dispatch(getTourPackageList());
    dispatch(getDestinationList());
  }, [dispatch]);

  const handleDestinationChange = (e) => {
    const destinationId = e.target.value;
    if (destinationId) {
      dispatch(getLocationByDestination(destinationId));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("destination", data.destination);
    formData.append("durationDays", data.durationDays);
    formData.append("pricePerPerson", data.pricePerPerson);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("availableSlots", data.availableSlots || 20);
    formData.append("includes", data.includes || ""); // Comma-separated string processed by backend

    // ✅ Handle Multiple Locations Selection Array cleanly
    if (data.location && data.location.length > 0) {
      formData.append("location", data.location.join(","));
    }

    // Append Image file binary
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (editId) {
      await dispatch(updateTourPackage({ id: editId, formData }));
      setEditId(null);
    } else {
      await dispatch(addTourPackage(formData));
    }

    dispatch(getTourPackageList());
    reset();
    setSelectedFile(null);
    setShowForm(false);
  };

  const handleEdit = (pkg) => {
    setEditId(pkg._id);

    // Format dates to YYYY-MM-DD format so HTML input type="date" can display them
    const formattedStartDate = pkg.startDate ? new Date(pkg.startDate).toISOString().split("T")[0] : "";
    const formattedEndDate = pkg.endDate ? new Date(pkg.endDate).toISOString().split("T")[0] : "";

    reset({
      title: pkg.title,
      description: pkg.description,
      destination: pkg.destination?._id || pkg.destination,
      location: pkg.location ? pkg.location.map((loc) => loc._id || loc) : [],
      durationDays: pkg.durationDays,
      pricePerPerson: pkg.pricePerPerson,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      availableSlots: pkg.availableSlots,
      includes: pkg.includes?.join(", "),
    });

    const destId = pkg.destination?._id || pkg.destination;
    if (destId) {
      dispatch(getLocationByDestination(destId));
    }

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteTourPackage(id));
    dispatch(getTourPackageList());
  };

  return (
    <Dashboard>
      <div className="tour-header">
        <div>
          <p className="subtitle">EXPLORE THE WORLD</p>
          <h2>Manage Your Tour Packages</h2>
        </div>

        <button className="add-tour-btn" onClick={() => { setEditId(null); reset(); setSelectedFile(null); setShowForm(true); }}>
          + Add Package
        </button>
      </div>

      {/* TOUR PACKAGE FORM */}
      {showForm && (
        <form className="tour-form" onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="form-grid">
            <div>
              <label>Package Title</label>
              <input {...register("title")} placeholder="Ultimate Himachal Tour" required />
            </div>

            <div>
              <label>Destination</label>
              <select {...register("destination", { onChange: handleDestinationChange })} required>
                <option value="">Select Destination</option>
                {destinationList?.map((item) => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div>
  <label>Locations</label>
  {locationList && locationList.length > 0 ? (
    <div>
      {locationList.map((item) => (
        <label key={item._id} className="checkbox-label">
          <input 
            type="checkbox"
            value={item._id}
            {...register("location")}
          />
          <span>{item.name}</span>
        </label>
      ))}
    </div>
  ) : (
    <p>Select a destination to load locations.</p>
  )}
</div>

            <div>
              <label>Duration (Days)</label>
              <input type="number" {...register("durationDays")} required />
            </div>

            <div>
              <label>Price Per Person (₹)</label>
              <input type="number" {...register("pricePerPerson")} required />
            </div>

            <div>
              <label>Available Slots</label>
              <input type="number" {...register("availableSlots")} defaultValue={20} required />
            </div>

            <div>
              <label>Start Date</label>
              <input type="date" {...register("startDate")} required />
            </div>

            <div>
              <label>End Date</label>
              <input type="date" {...register("endDate")} required />
            </div>

            <div>
              <label>Tour Poster</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="full-width-field">
            <label>What's Included (Comma separated)</label>
            <input placeholder="Hotel Stay, Breakfast, Tour Guide, Flights" {...register("includes")} />
          </div>

          <div className="full-width-field">
            <label>Description</label>
            <textarea {...register("description")} placeholder="Describe the tour itinerary..."></textarea>
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              {editId ? "Update Package" : "Create Package"}
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

      {/* TOUR CARDS DISPLAY GRID */}
      <div className="tour-list">
        {tourList?.map((pkg) => (
          <div className="tour-card" key={pkg._id}>
            <img
              src={pkg.image ? `http://localhost:8000${pkg.image}` : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"}
              alt={pkg.title}
              className="tour-img"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"; }}
            />

            <div className="tour-info">
              <span className="tour-duration">⏱ {pkg.durationDays} Days</span>
              <h3>{pkg.title}</h3>
              
              <p className="tour-dest">🌍 <strong>Region:</strong> {pkg.destination?.name || "N/A"}</p>
              
              <p className="tour-locs">
                📍 <strong>Spots:</strong> {pkg.location?.map(loc => loc.name).join(", ") || "N/A"}
              </p>

              <div className="tour-dates">
                📅 {pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : ""} - {pkg.endDate ? new Date(pkg.endDate).toLocaleDateString() : ""}
              </div>

              <div className="tour-includes">
                {pkg.includes?.map((item, index) => (
                  <span key={index} className="include-badge">✓ {item}</span>
                ))}
              </div>

              <div className="tour-footer">
                <p className="price">₹ {pkg.pricePerPerson} <span>/ person</span></p>
                <p className="slots">🎟 Left: {pkg.availableSlots}</p>
              </div>

              <div className="tour-actions">
                <button className="edit-btn" type="button" onClick={() => handleEdit(pkg)}>Edit</button>
                <button className="delete-btn" type="button" onClick={() => handleDelete(pkg._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Dashboard>
  );
};

export default TourPackages;