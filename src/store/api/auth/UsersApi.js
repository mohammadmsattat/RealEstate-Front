// src/store/api/Users/userApi.js
import { apiSlice } from "../apiSlice"; // assuming this file is already defined

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // جلب كل المستخدمين
    getUsers: builder.query({
      query: () => "/api/users", // رابط الـ GET الخاص بالمستخدمين
      providesTags: ["Users"],
    }),

    // جلب مستخدم معين باستخدام الـ ID
    getUserById: builder.query({
      query: (id) => `/api/users/${id}`, // رابط الـ GET الخاص بالمستخدم المفرد
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
} = userApi;