import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/',
        prepareHeaders: async (headers, query) => {
            const authToken = localStorage.getItem('jwtoken_auth');
            if (authToken) {
                headers.set('authorization', `Bearer ${authToken}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Users'],
    endpoints: (builder) => ({
        getOtp: builder.mutation({
            query: (phone) => ({
                url: `otp`,
                method: 'POST',
                body: {phone},
            }),
            invalidatesTags: ['Users'],
        }),

        verifyOtp: builder.mutation({
            query: ({phone,otp}) => ({
                url: 'otp/verify',
                method: 'POST',
                body: {phone,otp}
            }),
            invalidatesTags: ['Users'],
        }),

        registerUser: builder.mutation({
            query: (formData) => ({
                url: 'register',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Users'],
        }),

        registerDriver: builder.mutation({
            query: (formData) => ({
                url: 'driver/register',
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['Users'],
        }),

        getUser: builder.query({
            query: (userId) => `user/${userId}`,
          }),

          getDriver: builder.query({
            query: (userId) => `driver/${userId}`,
          }),

    }),
});

export const {useGetOtpMutation, useVerifyOtpMutation,useRegisterUserMutation, useRegisterDriverMutation,useGetUserQuery,useGetDriverQuery} = userApi;