import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = "https://flexi.aoudit.com/api/v1";
// const baseUrl = "http://localhost:8000/api/v1";

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token;
    console.log(token, "909");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  fetchFn: async (input, init?) => {
    try {
      console.log("📡 Making request to:", input);
      const response = await fetch(input, init);
      console.log("📩 Response:", response.status, response.ok);
      return response;
    } catch (error) {
      console.error("❌ Network error:", error);
      throw error;
    }
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
    "Address",
  ],
  endpoints: () => ({}),
});

export default api;
