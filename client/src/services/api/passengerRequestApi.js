import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// https://gotogether1.vercel.app/
export const passengerRequestApi = createApi({
  reducerPath: "passengerRequestApi",
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
  tagTypes: ["PassengerRequest"],
  endpoints: (builder) => ({
    postPassengerRequest: builder.mutation({
      query: (data) => ({
        url: `passenger/request`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PassengerRequest"],
    }),

    getPassengerRequests: builder.query({
      query: (id) => `passenger/request/${id}`,
      providesTags: ["PassengerRequest"],
      refetchOnMountOrArgChange: true,
    }),

    declineRequest: builder.mutation({
      query: (id) => ({
        url: `request/decline/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["PassengerRequest"],
    }),
    approveRequest: builder.mutation({
      query: (data) => ({
        url: `request/approve`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PassengerRequest"],
    }),
  }),
});

export const {usePostPassengerRequestMutation, useGetPassengerRequestsQuery, useDeclineRequestMutation, useApproveRequestMutation } = passengerRequestApi;
