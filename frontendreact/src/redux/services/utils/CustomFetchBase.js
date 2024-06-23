import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import { setIsParsing, setLoading } from "../../features/Loading/LoadingSlice";

console.log(process.env);

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
console.log(BASE_URL);

let activeRequestsCount = 0; // Counter for active requests

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}`,
  prepareHeaders: (headers, { getState }) => {
    let accessToken = localStorage.getItem("accessToken");
    const token = accessToken;

    headers.set("Authorization", `Bearer ${token}`);
    headers.set("Access-Control-Allow-Origin", "*");
  },
});

const customFetchBase = async (args, api, extraOptions) => {
  try {
    if (activeRequestsCount === 0) {
      api.dispatch(setLoading(true)); // Set loading to true if no ongoing requests
    }
    activeRequestsCount++; // Increment active requests counter

    let result = await baseQuery(args, api, extraOptions);

    activeRequestsCount--; // Decrement active requests counter
    if (activeRequestsCount === 0) {
      api.dispatch(setLoading(false)); // Set loading to false if no ongoing requests
      api.dispatch(setIsParsing(false));
    }

    return result;
  } catch (error) {
    activeRequestsCount--; // Decrement active requests counter
    if (activeRequestsCount === 0) {
      api.dispatch(setLoading(false)); // Set loading to false if no ongoing requests
      api.dispatch(setIsParsing(false));
    }

    console.log("Request error");
  }
};

export default customFetchBase;
