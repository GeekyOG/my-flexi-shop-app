// store/api/kycApi.ts
import { api } from "./apiSlice";

export const kycApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all KYCs (Admin)
    getKycs: builder.query({
      query: ({ page = 1, size = 20, search = "", status }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        return `/kyc?${params.toString()}`;
      },
      providesTags: ["KYC"],
    }),

    // Get single KYC (Admin)
    getKyc: builder.query({
      query: (id) => `/kyc/${id}?includeImageData=false`,
      providesTags: (result, error, id) => [{ type: "KYC", id }],
    }),

    // Get KYC image (Admin)
    getKycImage: builder.query({
      query: (id) => ({
        url: `/kyc/${id}/image`,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: (result, error, id) => [{ type: "KYC", id: `${id}-image` }],
    }),

    // Get my KYC (Customer)
    getMyKyc: builder.query({
      query: () => `/kyc/my-kyc`,
      providesTags: ["MyKYC"],
    }),

    // Get my KYC image (Customer)
    getMyKycImage: builder.query({
      query: () => ({
        url: `/kyc/my-kyc/image`,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["MyKYCImage"],
    }),

    // Submit KYC (Customer)
    submitKyc: builder.mutation({
      query: (formData) => ({
        url: `/kyc/submit`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["MyKYC", "MyKYCImage", "KYC"],
    }),

    // Update KYC (Customer - resubmit)
    updateKyc: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/kyc/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["MyKYC", "MyKYCImage", "KYC"],
    }),

    // Approve KYC (Admin)
    approveKyc: builder.mutation({
      query: (id) => ({
        url: `/kyc/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["KYC", "Customers", "MyKYC"],
    }),

    // Reject KYC (Admin)
    rejectKyc: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/kyc/${id}/reject`,
        method: "PUT",
        body: { reason },
      }),
      invalidatesTags: ["KYC", "Customers", "MyKYC"],
    }),

    // Delete KYC (Admin)
    deleteKyc: builder.mutation({
      query: (id) => ({
        url: `/kyc/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["KYC"],
    }),
  }),
});

export const {
  useGetKycsQuery,
  useGetKycQuery,
  useGetKycImageQuery,
  useGetMyKycQuery,
  useGetMyKycImageQuery,
  useSubmitKycMutation,
  useUpdateKycMutation,
  useApproveKycMutation,
  useRejectKycMutation,
  useDeleteKycMutation,
} = kycApi;
