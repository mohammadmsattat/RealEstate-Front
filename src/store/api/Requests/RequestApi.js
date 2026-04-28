import { RequestsEndPoint } from "@/Api/globalData";
import { apiSlice } from "../apiSlice";

export const requestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ===== GET ALL REQUESTS =====
    getRequests: builder.query({
      query: (filters = {}) => {
        const params = new URLSearchParams();

        const appendParams = (obj, parentKey = "") => {
          Object.entries(obj).forEach(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;

            if (value !== "" && value !== undefined && value !== null) {
              if (typeof value === "object" && !Array.isArray(value)) {
                appendParams(value, fullKey);
              } else if (Array.isArray(value)) {
                value.forEach((val) => {
                  params.append(fullKey, val);
                });
              } else {
                params.append(fullKey, value);
              }
            }
          });
        };

        appendParams(filters);

        return `${RequestsEndPoint}?${params.toString()}`;
      },
      providesTags: ["Requests"],
    }),

    // ===== GET REQUEST BY ID =====
    getRequestById: builder.query({
      query: (id) => `${RequestsEndPoint}/${id}`,
    }),

    // ===== CREATE REQUEST =====
    createRequest: builder.mutation({
      query: (data) => ({
        url: RequestsEndPoint,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Requests"],
    }),

    // ===== UPDATE REQUEST =====
    updateRequest: builder.mutation({
      query: ({ id, data }) => ({
        url: `${RequestsEndPoint}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Requests"],
    }),

    // ===== DELETE REQUEST =====
    deleteRequest: builder.mutation({
      query: (id) => ({
        url: `${RequestsEndPoint}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Requests"],
    }),

    matchRequestWithOffers: builder.query({
      query: (id) => `${RequestsEndPoint}/match-offers/${id}`,
      providesTags: (result, error, id) => [{ type: "Requests", id }],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useGetRequestByIdQuery,
  useCreateRequestMutation,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
  useMatchRequestWithOffersQuery,
} = requestApi;
