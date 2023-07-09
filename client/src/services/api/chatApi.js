import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
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
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    createChat: builder.mutation({
      query: (data) => ({
        url: `chat`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    sendMessage: builder.mutation({
      query: (data) => ({
        url: `message`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    getAllMessages: builder.query({
      query: (chatId) => `message/${chatId}`,
      providesTags: ["Chat"],
    }),
  }),
});

export const { useCreateChatMutation, useSendMessageMutation, useGetAllMessagesQuery } = chatApi;
