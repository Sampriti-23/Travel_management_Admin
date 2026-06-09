import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Store/Api";

/* ========================
   GET LOCATIONS BY DESTINATION
======================== */
export const getLocationByDestination = createAsyncThunk(
  "location/getLocationByDestination",
  async (destinationId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/location/destination/${destinationId}`
      );

      if (response?.data?.status_code === 200) {
        return response.data;
      }

      return rejectWithValue("Failed");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ========================
   ADD LOCATION
======================== */
export const addLocation = createAsyncThunk(
  "location/addLocation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/location/create",
        data
      );

      if (response?.data?.status_code === 201) {
        return response.data;
      }

      return rejectWithValue("Failed");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ========================
   UPDATE LOCATION
======================== */
export const updateLocation = createAsyncThunk(
  "location/updateLocation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/location/${id}`,
        data
      );

      if (response?.data?.status_code === 200) {
        return response.data;
      }

      return rejectWithValue("Failed");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

/* ========================
   DELETE LOCATION
======================== */
export const deleteLocation = createAsyncThunk(
  "location/deleteLocation",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/location/${id}`
      );

      if (response?.data?.status_code === 200) {
        return id;
      }

      return rejectWithValue("Failed");
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

const locationSlice = createSlice({
  name: "location",

  initialState: {
    locationList: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* GET LOCATIONS */
      .addCase(
        getLocationByDestination.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        getLocationByDestination.fulfilled,
        (state, action) => {
          state.loading = false;
          state.locationList =
            action.payload.data;
        }
      )

      .addCase(
        getLocationByDestination.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /* ADD LOCATION */
      .addCase(addLocation.pending, (state) => {
        state.loading = true;
      })

      .addCase(addLocation.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(
        addLocation.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /* UPDATE LOCATION */
      .addCase(updateLocation.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        updateLocation.fulfilled,
        (state, action) => {
          state.loading = false;

          const updatedLocation =
            action.payload.data;

          const index =
            state.locationList.findIndex(
              (item) =>
                item._id ===
                updatedLocation._id
            );

          if (index !== -1) {
            state.locationList[index] =
              updatedLocation;
          }
        }
      )

      .addCase(
        updateLocation.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /* DELETE LOCATION */
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        deleteLocation.fulfilled,
        (state, action) => {
          state.loading = false;

          state.locationList =
            state.locationList.filter(
              (item) =>
                item._id !== action.payload
            );
        }
      )

      .addCase(
        deleteLocation.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default locationSlice.reducer;