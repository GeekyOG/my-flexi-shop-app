// store/api/kycApi.ts
import { api } from "./apiSlice";

export const kycApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ── Admin ────────────────────────────────────────────────

    // Get all KYCs
    getKycs: builder.query({
      query: ({ page = 1, limit = 20, status } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (status) params.append("status", status);
        return `/kyc?${params.toString()}`;
      },
      providesTags: ["KYC"],
    }),

    // Get single KYC record (pass includeImageData=true to get base64)
    getKyc: builder.query({
      query: ({ id, includeImageData = false }) =>
        `/kyc/${id}?includeImageData=${includeImageData}`,
      providesTags: (_result, _error, { id }) => [{ type: "KYC", id }],
    }),

    // Stream raw image bytes (admin)
    getKycImage: builder.query({
      query: (id) => ({
        url: `/kyc/${id}/image`,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: (_result, _error, id) => [
        { type: "KYC", id: `${id}-image` },
      ],
    }),

    // Approve KYC — backend uses PATCH
    approveKyc: builder.mutation({
      query: (id) => ({
        url: `/kyc/${id}/approve`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        "KYC",
        "Customers",
        "MyKYC",
        { type: "KYC", id },
      ],
    }),

    // Reject KYC — backend uses PATCH
    rejectKyc: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/kyc/${id}/reject`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "KYC",
        "Customers",
        "MyKYC",
        { type: "KYC", id },
      ],
    }),

    // Delete KYC
    deleteKyc: builder.mutation({
      query: (id) => ({
        url: `/kyc/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["KYC"],
    }),

    // ── Customer ─────────────────────────────────────────────

    // Get own KYC record
    getMyKyc: builder.query({
      query: (params: { includeImageData?: boolean } = {}) =>
        `/kyc/me?includeImageData=${params.includeImageData ?? false}`,
      providesTags: ["MyKYC"],
    }),

    // Stream own raw KYC image
    getMyKycImage: builder.query({
      query: () => ({
        url: `/kyc/me/image`,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: ["MyKYCImage"],
    }),

    // Submit first KYC — POST /kyc (multipart/form-data)
    submitKyc: builder.mutation({
      query: (formData: FormData) => ({
        url: `/kyc`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["MyKYC", "MyKYCImage", "KYC"],
    }),

    // Re-submit rejected KYC — PUT /kyc/me (multipart/form-data)
    updateMyKyc: builder.mutation({
      query: (formData: FormData) => ({
        url: `/kyc/me`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["MyKYC", "MyKYCImage", "KYC"],
    }),
  }),
});

export const {
  // Admin
  useGetKycsQuery,
  useGetKycQuery,
  useGetKycImageQuery,
  useApproveKycMutation,
  useRejectKycMutation,
  useDeleteKycMutation,
  // Customer
  useGetMyKycQuery,
  useGetMyKycImageQuery,
  useSubmitKycMutation,
  useUpdateMyKycMutation,
} = kycApi;
