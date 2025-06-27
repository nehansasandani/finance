import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../slices/users/userSlices"; // Corrected import statement
import expensesReducer from "../slices/expenses/expensesSlices"; // Import expensesReducer from expensesSlice
import incomeReducer from "../slices/income/incomeSlices"; // Import incomeReducer from incomeSlice
import pettyReducer from "../slices/petty/pettySlices"; // Corrected import path for pettySlices

const store = configureStore({
  reducer: {
    user: usersReducer, // Corrected reducer name
    expenses: expensesReducer, // Add expensesReducer to the store
    income: incomeReducer, // Add incomeReducer to the store
    petty: pettyReducer, // Add pettyReducer to the store
  },
});

export default store;