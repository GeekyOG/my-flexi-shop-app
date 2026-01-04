import { api } from "./apiSlice";

export const salesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query({
      query: ({
        page = 1,
        size = 20,
        search = "",
        status,
        customerId,
        productId,
      }) => {
        const params = new URLSearchParams({ page, size });
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (customerId) params.append("customerId", customerId);
        if (productId) params.append("productId", productId);
        return `/sales?${params.toString()}`;
      },
      providesTags: ["Sales"],
    }),
    getSale: builder.query({
      query: (id) => `/sales/${id}`,
      providesTags: (result, error, id) => [{ type: "Sales", id }],
    }),
    updateSale: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Sales"],
    }),
    cancelSale: builder.mutation({
      query: (id) => ({
        url: `/sales/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Sales"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetSaleQuery,
  useUpdateSaleMutation,
  useCancelSaleMutation,
} = salesApi;
