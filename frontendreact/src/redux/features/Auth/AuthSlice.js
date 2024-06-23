import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // token: "",
  loggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setLoggedIn, setUser } = authSlice.actions;

export const getLoggedIn = (state) => state.authState.loggedIn;
export const getUser = (state) => state.authState?.user;
export default authSlice.reducer;
