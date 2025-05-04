import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ pageNumber, keyword, category }) => ({
        url: PRODUCTS_URL,
        params: {
          pageNumber,
          keyword,
          category,
        },
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `${PRODUCTS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: () => ({
        url: PRODUCTS_URL,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    editProduct: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    addToFavourites: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/favourite`,
        method: "POST",
      }),
      invalidatesTags: ["Product"],
    }),
    removeFromFavourites: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/favourite`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getFavouriteProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/favourite`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
    getCategories: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/categories`,
      }),
      keepUnusedDataFor: 5,
    }),
    getRelatedProducts: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}/related`,
      }),
      providesTags: ["Product"],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useEditProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useAddToFavouritesMutation,
  useRemoveFromFavouritesMutation,
  useGetFavouriteProductsQuery,
  useGetCategoriesQuery,
  useGetRelatedProductsQuery,
} = productsApiSlice;
