import { api } from "./apiSlice";

export const productsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({
        page = 1,
        size = 20,
        search = "",
        vendorId,
        categoryId,
        minPrice,
        maxPrice,
      }) => {
        const params = new URLSearchParams({ page, size });
        if (search) params.append("search", search);
        if (vendorId) params.append("vendorId", vendorId);
        if (categoryId) params.append("categoryId", categoryId);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        return `/products?${params.toString()}`;
      },
      providesTags: ["Products"],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    getTopSellingProducts: builder.query({
      query: (limit = 10) => `/products/top-selling?limit=${limit}`,
      providesTags: ["Products"],
    }),
    getMostViewedProducts: builder.query({
      query: (limit = 10) => `/products/most-viewed?limit=${limit}`,
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Products", id },
        "Products",
      ],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetTopSellingProductsQuery,
  useGetMostViewedProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
