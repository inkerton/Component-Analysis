import { configureStore } from "@reduxjs/toolkit";

// API
import { authApi } from "../services/api/AuthApi";
import { sbomApi } from "../services/api/SbomApi";

// Reducers
import loadingReducer from "../features/Loading/LoadingSlice";
import authReducer from "../features/Auth/AuthSlice";
import sbomReducer from "../features/sbom/sbomSlice";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [sbomApi.reducerPath]: sbomApi.reducer,
    loadingState: loadingReducer,
    authState: authReducer,
    sbomState: sbomReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat([authApi.middleware, sbomApi.middleware]),
});
