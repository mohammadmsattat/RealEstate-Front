import { AuthEndPoint } from "@/Api/globalData";
import { apiSlice } from "../apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    registerUser: builder.mutation({
      query: (user) => ({
        url: `${AuthEndPoint}/signup`,
        method: "POST",
        body: user,
      }),
    }),

    loginUser: builder.mutation({
      query: (data) => ({
        url: `${AuthEndPoint}/login`,
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApi;