import React, { useEffect, useState } from "react";
import Dashboard from "../../layout/Dashboard";
import "./location.css";

import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import {
  addDestination,
  getDestinationList,
  updateDestination,
  deleteDestination,
} from "../../Reducer/DestinationSlice";

import {
  addLocation,
  updateLocation,
  deleteLocation,
} from "../../Reducer/LocationSlice";

const DestinationLocation = () => {
  const dispatch = useDispatch();

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [editType, setEditType] =
    useState("");

  const [selectedItem, setSelectedItem] =
    useState(null);

  const {
    register: registerDestination,
    handleSubmit: handleDestinationSubmit,
    reset: resetDestination,
  } = useForm();

  const {
    register: registerLocation,
    handleSubmit: handleLocationSubmit,
    reset: resetLocation,
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
  } = useForm();

  const { destinationList } = useSelector(
    (state) => state.destination
  );

  useEffect(() => {
    dispatch(getDestinationList());
  }, [dispatch]);

  const onDestinationSubmit = async (data) => {
    await dispatch(addDestination(data));

    dispatch(getDestinationList());

    resetDestination();
  };

  const onLocationSubmit = async (data) => {
    await dispatch(addLocation(data));

    dispatch(getDestinationList());

    resetLocation();
  };

  const handleEditDestination = (
    destination
  ) => {
    setEditType("destination");

    setSelectedItem(destination);

    resetEdit({
      name: destination.name,
      description:
        destination.description,
    });

    setShowEditModal(true);
  };

  const handleEditLocation = (
    location
  ) => {
    setEditType("location");

    setSelectedItem(location);

    resetEdit({
      name: location.name,
    });

    setShowEditModal(true);
  };

  const handleDeleteDestination =
    async (id) => {
      await dispatch(
        deleteDestination(id)
      );

      dispatch(getDestinationList());
    };

  const handleDeleteLocation =
    async (id) => {
      await dispatch(
        deleteLocation(id)
      );

      dispatch(getDestinationList());
    };

  const onUpdateSubmit = async (
    data
  ) => {
    if (editType === "destination") {
      await dispatch(
        updateDestination({
          id: selectedItem._id,
          data,
        })
      );
    }

    if (editType === "location") {
      await dispatch(
        updateLocation({
          id: selectedItem._id,
          data,
        })
      );
    }

    dispatch(getDestinationList());

    setShowEditModal(false);
  };

  return (
    <Dashboard>
      <div className="destination-page">
        <div className="page-header">
          <h2>
            Destinations & Locations
          </h2>
        </div>

        <div className="form-section">
          {/* Destination Form */}

          <div className="form-card">
            <h3>Add Destination</h3>

            <form
              onSubmit={handleDestinationSubmit(
                onDestinationSubmit
              )}
            >
              <div className="form-group">
                <label>
                  Destination Name
                </label>

                <input
                  type="text"
                  placeholder="Enter destination name"
                  {...registerDestination(
                    "name",
                    {
                      required: true,
                    }
                  )}
                />
              </div>

              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  placeholder="Enter destination description"
                  {...registerDestination(
                    "description",
                    {
                      required: true,
                    }
                  )}
                />
              </div>

              <button
                type="submit"
                className="save-btn"
              >
                Save Destination
              </button>
            </form>
          </div>

          {/* Location Form */}

          <div className="form-card">
            <h3>Add Location</h3>

            <form
              onSubmit={handleLocationSubmit(
                onLocationSubmit
              )}
            >
              <div className="form-group">
                <label>
                  Destination
                </label>

                <select
                  {...registerLocation(
                    "destination",
                    {
                      required: true,
                    }
                  )}
                >
                  <option value="">
                    Select Destination
                  </option>

                  {destinationList?.map(
                    (item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Location Name
                </label>

                <input
                  type="text"
                  placeholder="Enter location name"
                  {...registerLocation(
                    "name",
                    {
                      required: true,
                    }
                  )}
                />
              </div>

              <button
                type="submit"
                className="save-btn"
              >
                Save Location
              </button>
            </form>
          </div>
        </div>

        {/* Listing */}

        <div className="destination-list">
          {destinationList?.map(
            (destination) => (
              <div
                className="destination-card"
                key={destination._id}
              >
                <div className="destination-header">
                  <h3>
                    🌍 {destination.name}
                  </h3>
                </div>

                <p>
                  {
                    destination.description
                  }
                </p>

                <div className="location-tags">
                  {destination
                    .locations?.length >
                  0 ? (
                    destination.locations.map(
                      (location) => (
                        <div
                          key={
                            location._id
                          }
                          className="location-chip"
                        >
                          <span>
                            📍{" "}
                            {
                              location.name
                            }
                          </span>

                          <button
                            type="button"
                            className="mini-edit"
                            onClick={() =>
                              handleEditLocation(
                                location
                              )
                            }
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            className="mini-delete"
                            onClick={() =>
                              handleDeleteLocation(
                                location._id
                              )
                            }
                          >
                            ❌
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <span>
                      No locations
                      added
                    </span>
                  )}
                </div>

                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    type="button"
                    onClick={() =>
                      handleEditDestination(
                        destination
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    type="button"
                    onClick={() =>
                      handleDeleteDestination(
                        destination._id
                      )
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Edit Modal */}

        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h3>
                {editType ===
                "destination"
                  ? "Edit Destination"
                  : "Edit Location"}
              </h3>

              <form
                onSubmit={handleEditSubmit(
                  onUpdateSubmit
                )}
              >
                <div className="form-group">
                  <label>Name</label>

                  <input
                    {...registerEdit(
                      "name"
                    )}
                    required
                  />
                </div>

                {editType ===
                  "destination" && (
                  <div className="form-group">
                    <label>
                      Description
                    </label>

                    <textarea
                      {...registerEdit(
                        "description"
                      )}
                      required
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="submit"
                    className="save-btn"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      setShowEditModal(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Dashboard>
  );
};

export default DestinationLocation;