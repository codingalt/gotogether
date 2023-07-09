import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
// https://gotogether1.vercel.app/
export const campaignsApi = createApi({
  reducerPath: "campaignsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/",
    prepareHeaders: async (headers, query) => {
      const authToken = localStorage.getItem("jwtoken_auth");
      if (authToken) {
        headers.set("authorization", `Bearer ${authToken}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Campaigns"],
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: () => `campaigns`,
      providesTags: ["Campaigns"],
    }),

    getCampaignsById: builder.query({
      query: (id) => `campaign/${id}`,
    }),

    searchCampaigns: builder.mutation({
      query: (data) => ({
        url: `campaigns/search`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Campaigns"],
    }),
  }),
});

export const {useGetCampaignsQuery,useGetCampaignsByIdQuery, useSearchCampaignsMutation} = campaignsApi;