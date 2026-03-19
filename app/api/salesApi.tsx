// store/api/salesApi.ts
import { api } from "./apiSlice";

export const salesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ── Sales ────────────────────────────────────────────────

    getSales: builder.query({
      query: ({
        page = 1,
        size = 20,
        search = "",
        status,
        customerId,
        productId,
      }: {
        page?: number;
        size?: number;
        search?: string;
        status?: string;
        customerId?: string | number;
        productId?: string | number;
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
        });
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (customerId) params.append("customerId", String(customerId));
        if (productId) params.append("productId", String(productId));
        return `/sales?${params.toString()}`;
      },
      providesTags: ["Sales"],
    }),

    getSale: builder.query({
      query: (id: number | string) => `/sales/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Sales", id }],
    }),

    getSalesByReference: builder.query({
      query: (reference: string) => `/sales/reference/${reference}`,
      providesTags: (_result, _error, ref) => [{ type: "Sales", id: ref }],
    }),

    updateSale: builder.mutation({
      query: ({
        id,
        ...data
      }: {
        id: number | string;
        [key: string]: any;
      }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),

    cancelSale: builder.mutation({
      query: ({
        id,
        cancelRelated = false,
      }: {
        id: number | string;
        cancelRelated?: boolean;
      }) => ({
        url: `/sales/${id}/cancel`,
        method: "PATCH",
        body: { cancelRelated },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Sales",
        { type: "Sales", id },
      ],
    }),

    // ── Payments ─────────────────────────────────────────────

    /**
     * POST /sales/payment/initialize
     * Body: { items: { productId, quantity }[], addressId, partialPayment? }
     * Returns: { authorizationUrl, reference, saleIds, totalAmount, paymentAmount }
     */
    initializePayment: builder.mutation({
      query: ({
        items,
        addressId,
        partialPayment,
      }: {
        items: { productId: number | string; quantity: number }[];
        addressId: number | string;
        partialPayment?: number;
      }) => ({
        url: "/sales/payment/initialize",
        method: "POST",
        body: {
          items,
          addressId,
          ...(partialPayment ? { partialPayment } : {}),
        },
      }),
      invalidatesTags: ["Sales", "Cart"],
    }),

    /**
     * GET /sales/payment/verify/:reference
     * Returns payment + updated sale statuses
     */
    verifyPayment: builder.query({
      query: (reference: string) => `/sales/payment/verify/${reference}`,
      providesTags: (_result, _error, ref) => [
        { type: "Sales", id: `verify-${ref}` },
      ],
    }),

    /**
     * POST /sales/payment/additional
     * Body: { saleIds: number[], amount: number }
     * Returns: { authorizationUrl, reference, paymentAmount, totalBalance }
     */
    makeAdditionalPayment: builder.mutation({
      query: ({
        saleIds,
        amount,
      }: {
        saleIds: (number | string)[];
        amount: number;
      }) => ({
        url: "/sales/payment/additional",
        method: "POST",
        body: { saleIds, amount },
      }),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const {
  // Sales
  useGetSalesQuery,
  useGetSaleQuery,
  useGetSalesByReferenceQuery,
  useUpdateSaleMutation,
  useCancelSaleMutation,
  // Payments
  useInitializePaymentMutation,
  useVerifyPaymentQuery,
  useMakeAdditionalPaymentMutation,
} = salesApi;
