import { api } from "./apiSlice";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
    }),
    loginVendor: builder.mutation({
      query: (credentials) => ({
        url: "/vendors/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerVendor: builder.mutation({
      query: (data) => ({
        url: "/vendors/register",
        method: "POST",
        body: data,
      }),
    }),
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

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLoginVendorMutation,
  useRegisterVendorMutation,
  useLoginCustomerMutation,
  useRegisterCustomerMutation,
} = authApi;
