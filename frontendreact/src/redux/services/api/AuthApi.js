import customFetchBase from "../utils/CustomFetchBase";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setLoggedIn, setUser } from "../../features/Auth/AuthSlice";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customFetchBase,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    register: builder.mutation({
      query(registerData) {
        return {
          url: "api/auth/register",
          method: "POST",
          body: registerData,
        };
      },
      transformResponse: (result) => {
        return result?.data;
      },
    }),

    login: builder.mutation({
      query(loginData) {
        return {
          url: "api/auth/login",
          method: "POST",
          body: loginData,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);

          const accessToken = data.access_token;
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            dispatch(setLoggedIn(true));
          }
        } catch (error) {}
      },
      transformResponse: (result) => {
        console.log(result);
        return result?.data;
      },
    }),
    getCurrentUser: builder.query({
      query() {
        return {
          url: "api/users",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);

          const user = data[0];
          if (user) dispatch(setUser(user));
        } catch (error) {}
      },
      transformResponse: (result) => {
        console.log(result);
        return result?.data;
      },
    }),
    revalidate: builder.query({
      query() {
        return {
          url: "api/auth/revalidate",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);

          if (data?._id) {
            dispatch(setLoggedIn(true));
            dispatch(setUser(data));
          }
        } catch (error) {}
      },

      transformResponse: (result) => {
        console.log(result);
        return result?.data;
      },
    }),
  }),
});

export const { useLoginMutation, useRevalidateQuery, useGetCurrentUserQuery, useRegisterMutation } = authApi;
