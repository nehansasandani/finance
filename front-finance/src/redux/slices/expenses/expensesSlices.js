import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

// Create Expense Action
export const createExpenseAction = createAsyncThunk(
  "expenses/create",
  async (expenseData, { rejectWithValue, getState }) => {
    try {
      const { userAuth } = getState().user; // Get user from state
      const token = userAuth?.token; // Assuming token is stored in userAuth

      // API request to create the expense
      const response = await axios.post(
        `${baseURL}/expenses`,
        expenseData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data; // Return the created expense
    } catch (error) {
      if (!error?.response) {
        // Handle network errors (like no response)
        throw error;
      }
      return rejectWithValue(error.response.data); // Return error data from the server
    }
  }
);

// Slice for managing expenses
const expensesSlice = createSlice({
  name: "expenses", // Name of the slice
  initialState: {
    expenses: [], // List of expenses
    expenseLoading: false, // Loading state for API requests
    expenseError: null, // Error state for handling API errors
    expenseSuccess: false,  // Success state for confirming creation of expense
  },
  reducers: {
    // Reset success message after 3 seconds (for example)
    resetSuccess: (state) => {
      state.expenseSuccess = false; // Reset the success state
    },
  },
  extraReducers: (builder) => {
    // Handle loading state when the API request is in progress
    builder.addCase(createExpenseAction.pending, (state) => {
      state.expenseLoading = true; // Set loading state to true
      state.expenseError = null; // Reset any previous errors
      state.expenseSuccess = false; // Reset success state
    });

    // Handle success state when the API request is fulfilled
    builder.addCase(createExpenseAction.fulfilled, (state, action) => {
      // Append the new expense to the existing list of expenses
      state.expenses.push(action.payload);
      state.expenseLoading = false; // Set loading state to false
      state.expenseSuccess = true; // Set success state to true
    });

    // Handle error state when the API request is rejected
    builder.addCase(createExpenseAction.rejected, (state, action) => {
      state.expenseLoading = false; // Set loading state to false
      state.expenseError = action.payload; // Store the error message
      state.expenseSuccess = false; // Ensure success is false in case of an error
    });
  },
});

// Export actions and reducer
export const { resetSuccess } = expensesSlice.actions;
export default expensesSlice.reducer;
