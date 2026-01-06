import { api } from "./apiSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginCustomer: builder.mutation({
      query: (credentials) => ({
        url: "/customers/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerCustomer: builder.mutation({
      query: (data) => ({
        url: "/customers/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginCustomerMutation, useRegisterCustomerMutation } =
  authApi;
