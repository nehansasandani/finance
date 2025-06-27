import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";


// ✅ Async Action: Create Income
export const createIncomeAction = createAsyncThunk(
  "income/create",
  async (incomeData, { rejectWithValue, getState }) => {
    try {
      const { userAuth } = getState().user;
      const token = userAuth?.token; // Extract token

      if (!token) {
        throw new Error("Unauthorized: No token found.");
      }

      const response = await axios.post(`${baseURL}/income`, incomeData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Something went wrong. Try again."
      );
    }
  }
);

// ✅ Slice: Manage Incomes
const incomeSlice = createSlice({
  name: "income",
  initialState: {
    incomes: [],
    incomeLoading: false,
    incomeError: null,
    incomeCreated: false,
    incomeSuccess: false,
  },
  reducers: {
    resetSuccess: (state) => {
      state.incomeSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createIncomeAction.pending, (state) => {
        state.incomeLoading = true;
        state.incomeError = null;
        state.incomeSuccess = false;
      })
      .addCase(createIncomeAction.fulfilled, (state, action) => {
        state.incomes.push(action.payload);
        state.incomeLoading = false;
        state.incomeSuccess = true;
      })
      .addCase(createIncomeAction.rejected, (state, action) => {
        state.incomeLoading = false;
        state.incomeError = action.payload;
        state.incomeSuccess = false;
      });
  },
});

export const { resetSuccess } = incomeSlice.actions;
export default incomeSlice.reducer;
