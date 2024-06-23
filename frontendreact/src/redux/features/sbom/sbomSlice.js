import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // token: "",
  sbom: null,
  sboms: [],
  updateNotifications:null
};

const sbomSlice = createSlice({
  name: "sbom",
  initialState,
  reducers: {
    setSbom: (state, action) => {
      state.sbom = action.payload;
    },
    setSboms: (state, action) => {
      state.sboms = action.payload;
    },
    setUpdateNotifications:(state,action)=>{
      state.updateNotifications=action.payload;
    }
  },
});

export const { setSbom, setSboms,setUpdateNotifications } = sbomSlice.actions;

export const getSboms = (state) => state.sbomState.sboms;
export const getSbom = (state) => state.sbomState.sbom;
export const getUpdateNotifications=(state)=>state.sbomState.updateNotifications;
export default sbomSlice.reducer;
