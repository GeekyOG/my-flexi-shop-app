import type { BaseQueryFn, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { FetchArgs } from "@reduxjs/toolkit/query/react";
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

// Custom base query wrapper to handle 401 responses
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Clear auth state
    api.dispatch({ type: "auth/logout" });

    // router.replace("/login");

    console.log("🔒 Unauthorized - redirecting to login");
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
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
