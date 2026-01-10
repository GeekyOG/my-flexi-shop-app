import { api } from "./apiSlice";

export const productImagesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductImages: builder.query({
      query: ({ productId, includeImageData = false }) =>
        `/product-images/product/${productId}?includeImageData=${includeImageData}`,
      providesTags: (result, error, { productId }) => [
        { type: "ProductImages", id: productId },
      ],
    }),
    getProductImage: builder.query({
      query: (imageId) => ({
        url: `/product-images/${imageId}`,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: (result, error, imageId) => [
        { type: "ProductImages", id: imageId },
      ],
    }),
    getDisplayImage: builder.query({
      query: (productId) => ({
        url: `/product-images/product/${productId}/display`,
        responseHandler: (response) => response.blob(),
      }),
      providesTags: (result, error, productId) => [
        { type: "ProductImages", id: `display-${productId}` },
      ],
    }),
    uploadProductImages: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `/product-images/product/${productId}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "ProductImages", id: productId },
        { type: "Products" },
      ],
    }),
    setDisplayImage: builder.mutation({
      query: (imageId) => ({
        url: `/product-images/${imageId}/display`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, imageId) => ["ProductImages"],
    }),
    updateImageOrder: builder.mutation({
      query: ({ imageId, displayOrder }) => ({
        url: `/product-images/${imageId}/order`,
        method: "PATCH",
        body: { displayOrder },
      }),
      invalidatesTags: ["ProductImages"],
    }),
    deleteProductImage: builder.mutation({
      query: (imageId) => ({
        url: `/product-images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ProductImages", "Products"],
    }),
    deleteAllProductImages: builder.mutation({
      query: (productId) => ({
        url: `/product-images/product/${productId}/all`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, productId) => [
        { type: "ProductImages", id: productId },
        { type: "Products" },
      ],
    }),
  }),
});

export const {
  useGetProductImagesQuery,
  useGetProductImageQuery,
  useGetDisplayImageQuery,
  useUploadProductImagesMutation,
  useSetDisplayImageMutation,
  useUpdateImageOrderMutation,
  useDeleteProductImageMutation,
  useDeleteAllProductImagesMutation,
} = productImagesApi;
