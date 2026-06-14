import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../layout/Dashboard";
import {
  getBookingList,
  updateBooking,
  deleteBooking,
} from "../../Reducer/BookingSlice";

import "./booking.css";

const BookingAdmin = () => {
  const dispatch = useDispatch();

  const { bookingList, loading } = useSelector(
    (state) => state.booking
  );

  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    dispatch(getBookingList());
  }, [dispatch]);

  useEffect(() => {
    const temp = {};

    bookingList?.forEach((booking) => {
      temp[booking._id] = booking.status;
    });

    setStatusMap(temp);
  }, [bookingList]);

  const handleStatusChange = (id, value) => {
    setStatusMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = (booking) => {
    dispatch(
      updateBooking({
        id: booking._id,
        FormData: {
          status: statusMap[booking._id],
        },
      })
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this booking?")) {
      dispatch(deleteBooking(id));
    }
  };

  return (
    <Dashboard>
    <div className="booking-admin">
      <h2>Booking Management</h2>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>People</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookingList?.length > 0 ? (
                bookingList.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      {booking.user?.name || "N/A"}
                    </td>

                    <td>{booking.type}</td>

                    <td>
                      {booking.checkIn
                        ? new Date(
                            booking.checkIn
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      {booking.checkOut
                        ? new Date(
                            booking.checkOut
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>{booking.numOfPeople}</td>

                    <td>
                      ₹{booking.totalAmount}
                    </td>

                    <td>
                      <select
                        value={
                          statusMap[booking._id] ||
                          booking.status
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            booking._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="pending">
                          Pending
                        </option>

                        <option value="confirmed">
                          Confirmed
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                        <option value="completed">
                          Completed
                        </option>
                      </select>
                    </td>

                    <td className="action-btns">
                      <button
                        className="update-btn"
                        onClick={() =>
                          handleUpdate(booking)
                        }
                      >
                        Update
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(booking._id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </Dashboard>
  );
};

export default BookingAdmin;