import { OffersEndPoint } from "@/Api/globalData";
import { apiSlice } from "../apiSlice";

export const offerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
      getOffers: builder.query({
      query: (filters = {}) => {
        // تحويل الفلاتر إلى query string
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "" && value !== undefined && value !== null) {
            params.append(key, value);
          }
        });

        return `${OffersEndPoint}?${params.toString()}`;
      },
      providesTags: ["Offers"],
    }),
    getOfferById: builder.query({
      query: (id) => `${OffersEndPoint}/${id}`,
    }),
    createOffer: builder.mutation({
      query: (data) => ({
        url: OffersEndPoint,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Offers"],
    }),
    updateOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `${OffersEndPoint}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Offers"],
    }),
    deleteOffer: builder.mutation({
      query: (id) => ({ url: `${OffersEndPoint}/${id}`, method: "DELETE" }),
      invalidatesTags: ["Offers"],
    }),
  }),
});

export const {
  useGetOffersQuery,
  useGetOfferByIdQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useDeleteOfferMutation,
} = offerApi;
