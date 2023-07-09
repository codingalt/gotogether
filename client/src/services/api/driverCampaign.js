import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const driverCampaignApi = createApi({
  reducerPath: "driverCampaignApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://gotogether-283d17c4540b.herokuapp.com/",
    prepareHeaders: async (headers, query) => {
      const authToken = localStorage.getItem("jwtoken_auth");
      if (authToken) {
        headers.set("authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["DriverCampaign"],
  endpoints: (builder) => ({
    postCampaign: builder.mutation({
      query: (data) => ({
        url: `driver/campaign`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["DriverCampaign"],
    }),

    getCampaignsByDriverId: builder.query({
      query: (userId) => `driver/campaign/${userId}`,
    }),
  }),
});

export const {usePostCampaignMutation,useGetCampaignsByDriverIdQuery} = driverCampaignApi;