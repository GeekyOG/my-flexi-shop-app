import { api } from "./apiSlice";

export const vendorsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: ({ page = 1, size = 20, search = "", isVerified }) => {
        const params = new URLSearchParams({ page, size });
        if (search) params.append("search", search);
        if (isVerified !== undefined) params.append("isVerified", isVerified);
        return `/vendors?${params.toString()}`;
      },
      providesTags: ["Vendors"],
    }),
    getVendor: builder.query({
      query: (id) => `/vendors/${id}`,
      providesTags: (result, error, id) => [{ type: "Vendors", id }],
    }),
    createVendor: builder.mutation({
      query: (data) => ({
        url: "/vendors/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Vendors"],
    }),
    updateVendor: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/vendors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Vendors"],
    }),
    verifyVendor: builder.mutation({
      query: (id) => ({
        url: `/vendors/${id}/verify`,
        method: "PATCH",
      }),
      invalidatesTags: ["Vendors"],
    }),
    deleteVendor: builder.mutation({
      query: (id) => ({
        url: `/vendors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Vendors"],
    }),
  }),
});

export const {
  useGetVendorsQuery,
  useGetVendorQuery,
  useCreateVendorMutation,
  useUpdateVendorMutation,
  useVerifyVendorMutation,
  useDeleteVendorMutation,
} = vendorsApi;
