import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import baseURL from "../../../utils/baseURL";

// Login action
// Login action
export const loginUserAction = createAsyncThunk(
  'user/login',
  async (payload, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(`${baseURL}/users/login`, payload, config);
      
      // Store token in localStorage on successful login
      localStorage.setItem('token', data.token);
      

      return data; // Return the login data (token, user info, etc.)
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);


// Register action
export const registerUserAction = createAsyncThunk(
  'user/register',
  async (payload, { rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const { data } = await axios.post(`${baseURL}/users/register`, payload, config);
      return data;
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

const usersSlice = createSlice({
  name: 'user',
  initialState: {
    userAuth: null,
    userLoading: false,
    userAppErr: null,
    userServerErr: null,
    isLogin: false,
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserAction.pending, (state) => {
      state.userLoading = true;
      state.userAppErr = undefined;
      state.userServerErr = undefined;
    });
    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.userLoading = false;
      state.userAppErr = undefined;
      state.userServerErr = undefined;
      state.isLogin = true;
    });
    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userLoading = false;
      state.userAppErr = action?.payload?.message || "Invalid email or password";
      state.userServerErr = action.error.message;
    });
    builder.addCase(registerUserAction.pending, (state) => {
      state.userLoading = true;
      state.userAppErr = undefined;
      state.userServerErr = undefined;
    });
    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.userLoading = false;
      state.userAppErr = undefined;
      state.userServerErr = undefined;
      state.isLogin = true;
    });
    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.userLoading = false;
      state.userAppErr = action?.payload?.message || "Registration failed";
      state.userServerErr = action.error.message;
    });
  },
});

export default usersSlice.reducer;