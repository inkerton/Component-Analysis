import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isParsing: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsParsing: (state, action) => {
      state.isParsing = action.payload;
    },
  },
});

export const { setLoading, setIsParsing } = loadingSlice.actions;

export const getIsLoading = (state) => state.loadingState.isLoading;
export const getIsParsing = (state) => state.loadingState.isParsing;

export default loadingSlice.reducer;
