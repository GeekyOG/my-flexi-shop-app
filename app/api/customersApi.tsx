import { api } from "./apiSlice";

export const customersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ page = 1, size = 20, search = "", kycStatus }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        if (search) params.append("search", search);
        if (kycStatus) params.append("kycStatus", kycStatus);
        return `/customers?${params.toString()}`;
      },
      providesTags: ["Customers"],
    }),
    getCustomer: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: "Customers", id }],
    }),
    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/customers/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    updateCustomer: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/customers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Customers"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Customers"],
    }),
    getAddresses: builder.query({
      query: ({ page = 1, size = 100 }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        return `/customers/me/addresses`;
      },
      providesTags: ["Address"],
    }),
    getAddress: builder.query({
      query: (id) => `/customers/me/addresses/${id}`,
      providesTags: (result, error, id) => [{ type: "Address", id }],
    }),
    createAddress: builder.mutation({
      query: (data) => ({
        url: "/customers/me/addresses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/customers/me/addresses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/customers/me/addresses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  useGetAddressQuery,
  useGetAddressesQuery,
  useLazyGetAddressQuery,
  useLazyGetAddressesQuery,
  useLazyGetCustomerQuery,
  useLazyGetCustomersQuery,
  useUpdateAddressMutation,
} = customersApi;
