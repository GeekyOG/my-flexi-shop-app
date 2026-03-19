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
    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "/customers/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/customers/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginCustomerMutation,
  useRegisterCustomerMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
