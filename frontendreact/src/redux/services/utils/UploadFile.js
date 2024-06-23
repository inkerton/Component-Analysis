import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "multipart-form-data",
  },
});
