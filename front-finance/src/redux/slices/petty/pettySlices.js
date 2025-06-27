// src/redux/slices/petty/pettySlices.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to create petty cash
export const createPettyAction = createAsyncThunk(
  "petty/create",
  async (pettyData, { rejectWithValue, getState }) => {
    try {
      const {
        user: { userAuth },
      } = getState();

      const token = userAuth?.token;

      if (!token) {
        throw new Error("Not authorized, no token");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:8081/api/petty",
        pettyData,
        config
      );

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async action to fetch total petty cash
export const fetchPettyTotal = createAsyncThunk(
  "petty/fetchTotal",
  async (_, { rejectWithValue, getState }) => {
    try {
      const {
        user: { userAuth },
      } = getState();

      const token = userAuth?.token;

      if (!token) {
        throw new Error("Not authorized, no token");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:8081/api/petty/total",
        config
      );

      return data.total;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const pettySlice = createSlice({
  name: "petty",
  initialState: {
    pettyLoading: false,
    pettyError: null,
    pettyCreated: false,
    pettyTotal: 0,
    pettyTotalLoading: false,
    pettyTotalError: null,
  },
  reducers: {
    resetSuccess: (state) => {
      state.pettyCreated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPettyAction.pending, (state) => {
        state.pettyLoading = true;
        state.pettyError = null;
      })
      .addCase(createPettyAction.fulfilled, (state) => {
        state.pettyLoading = false;
        state.pettyCreated = true;
      })
      .addCase(createPettyAction.rejected, (state, action) => {
        state.pettyLoading = false;
        state.pettyError = action.payload;
      })
      .addCase(fetchPettyTotal.pending, (state) => {
        state.pettyTotalLoading = true;
        state.pettyTotalError = null;
      })
      .addCase(fetchPettyTotal.fulfilled, (state, action) => {
        state.pettyTotalLoading = false;
        state.pettyTotal = action.payload;
      })
      .addCase(fetchPettyTotal.rejected, (state, action) => {
        state.pettyTotalLoading = false;
        state.pettyTotalError = action.payload;
      });
  },
});

export const { resetSuccess } = pettySlice.actions;
export default pettySlice.reducer;
