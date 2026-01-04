import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Products",
    "Categories",
    "Vendors",
    "Customers",
    "Users",
    "Sales",
    "KYC",
    "Cart",
    "Wishlist",
  ],
  endpoints: () => ({}),
});

export default api;
