import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Store/Api";

/* ========================
   GET DESTINATIONS
======================== */
export const getDestinationList = createAsyncThunk(
  "destination/getDestinationList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/destination");

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
   ADD DESTINATION
======================== */
export const addDestination = createAsyncThunk(
  "destination/addDestination",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/destination/create",
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
   UPDATE DESTINATION
======================== */
export const updateDestination = createAsyncThunk(
  "destination/updateDestination",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/destination/${id}`,
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
   DELETE DESTINATION
======================== */
export const deleteDestination = createAsyncThunk(
  "destination/deleteDestination",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(
        `/destination/${id}`
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

const destinationSlice = createSlice({
  name: "destination",

  initialState: {
    destinationList: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* GET DESTINATIONS */
      .addCase(getDestinationList.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        getDestinationList.fulfilled,
        (state, action) => {
          state.loading = false;
          state.destinationList =
            action.payload.data;
        }
      )

      .addCase(
        getDestinationList.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /* ADD DESTINATION */
      .addCase(addDestination.pending, (state) => {
        state.loading = true;
      })

      .addCase(addDestination.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(
        addDestination.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /* UPDATE DESTINATION */
      .addCase(updateDestination.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        updateDestination.fulfilled,
        (state, action) => {
          state.loading = false;

          const updatedDestination =
            action.payload.data;

          const index =
            state.destinationList.findIndex(
              (item) =>
                item._id ===
                updatedDestination._id
            );

          if (index !== -1) {
            state.destinationList[index] =
              updatedDestination;
          }
        }
      )

      .addCase(
        updateDestination.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      /* DELETE DESTINATION */
      .addCase(deleteDestination.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        deleteDestination.fulfilled,
        (state, action) => {
          state.loading = false;

          state.destinationList =
            state.destinationList.filter(
              (item) =>
                item._id !== action.payload
            );
        }
      )

      .addCase(
        deleteDestination.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default destinationSlice.reducer;