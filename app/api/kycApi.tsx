import { api } from "./apiSlice";

export const kycApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getKycs: builder.query({
      query: ({ page = 1, size = 20, search = "", status }) => {
        const params = new URLSearchParams({ page, size });
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        return `/kyc?${params.toString()}`;
      },
      providesTags: ["KYC"],
    }),
    getKyc: builder.query({
      query: (id) => `/kyc/${id}`,
      providesTags: (result, error, id) => [{ type: "KYC", id }],
    }),
    approveKyc: builder.mutation({
      query: (id) => ({
        url: `/kyc/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: ["KYC", "Customers"],
    }),
    rejectKyc: builder.mutation({
      query: (id) => ({
        url: `/kyc/${id}/reject`,
        method: "PATCH",
      }),
      invalidatesTags: ["KYC", "Customers"],
    }),
  }),
});

export const {
  useGetKycsQuery,
  useGetKycQuery,
  useApproveKycMutation,
  useRejectKycMutation,
} = kycApi;
