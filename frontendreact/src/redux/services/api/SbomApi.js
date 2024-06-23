import { setSbom, setSboms, setUpdateNotifications } from "../../features/sbom/sbomSlice";
import customFetchBase from "../utils/CustomFetchBase";
import { createApi } from "@reduxjs/toolkit/query/react";

export const sbomApi = createApi({
  reducerPath: "sbomApi",
  baseQuery: customFetchBase,
  tagTypes: ["sbom"],
  endpoints: (builder) => ({
    getSboms: builder.query({
      query() {
        return {
          url: "api/sbom/getSboms",
          method: "GET",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSboms(data));
          console.log(data);
        } catch (error) {}
      },
      transformResponse: (result) => {
        console.log(result);
        return result?.data;
      },
      providesTags: ["sbom"],
    }),

    getSbomById: builder.query({
      query(sbomId) {
        return {
          url: `api/sbom/getSbom/${sbomId}`,
          method: "GET",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setSbom(data));
        } catch (error) {}
      },
      transformResponse: (result) => {
        console.log(result);
        return result?.data;
      },
    }),

    postSbom: builder.mutation({
      query(sbomPayload) {
        console.log("Sbom payload", sbomPayload);
        let url;
        const bodyFormData = new FormData();
        // debugger;
        if (sbomPayload.language === "javascript" && !sbomPayload.files.zip) {
          bodyFormData.append("package_lock_file", sbomPayload.files.packagedLock);
          bodyFormData.append("package_json_file", sbomPayload.files.packageJson);
          url = `api/${sbomPayload.language}/generateSbom`;
        } else if (sbomPayload.language === "python" && !sbomPayload.files.zip) {
          bodyFormData.append("requirement", sbomPayload.files.requirement);
          url = `api/${sbomPayload.language}/generateSbom`;
        } else if (sbomPayload.language === "java" && sbomPayload.files.pom) {
          bodyFormData.append("pom_file", sbomPayload.files.pom);
          url = `api/maven/generateSbom`;
        }else if (sbomPayload.language === "php" && sbomPayload.files.composerFile) {
          bodyFormData.append("composer_file", sbomPayload.files.composerFile);
          url = `api/php/generateSbom`;
        }else {
          bodyFormData.append("sourceCode", sbomPayload.files.zip);
          url = `api/sbom/generateSbomFromZip`;
        }
        console.log(bodyFormData);
        return {
          url,
          method: "POST",
          body: bodyFormData,
          formData: true,
        };
      },
      invalidatesTags: ["sbom"],
    }),

    deleteSbomById: builder.mutation({
      query(sbomId) {
        return {
          url: `api/sbom/deleteSbom/${sbomId}`,
          method: "DELETE",
        };
      },
      transformResponse: (result) => {
        console.log(result);
        return result?.data;
      },
      invalidatesTags: ["sbom"],
    }),



    generateReport: builder.mutation({
      query(sbomDataBlobFile) {
        console.log("Sbom Report JSON", sbomDataBlobFile);
        const bodyFormData = new FormData();
          bodyFormData.append("jsonDataFile", sbomDataBlobFile);
         let url = `api/sbom/generateSbomReport`;
        return {
          url,
          method: "POST",
          body: bodyFormData,
          formData: true,
        };
      },
      invalidatesTags: ["sbom"],
    }),

    getUpdateNotifications:builder.query({
      query(notificationPayload){
        const {userId,sbomId}=notificationPayload;
        return {
          url:`api/sbom/updatedNotifications/${userId}/${sbomId}`,
          method:"GET"
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // debugger;
          console.log(data)
          dispatch(setUpdateNotifications(data));
        } catch (error) {}
      },
      transformResponse: (result) => {
        console.log(result);
        return result?.data;
      },
    })
  }),
});

export const { usePostSbomMutation, useGetSbomsQuery, useGetSbomByIdQuery, useDeleteSbomByIdMutation ,useGenerateReportMutation,useGetUpdateNotificationsQuery} = sbomApi;
