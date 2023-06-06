import { createApi } from '@reduxjs/toolkit/dist/query/react'
import baseQuery from './customBaseQuery'

export const lotApi = createApi({ 
  reducerPath: 'lotAPI',
  baseQuery: baseQuery,
  tagTypes: ['Lot', 'Bets', 'Offers', 'Categories', 'Subcategories', 'Features', 'Lots'],
  endpoints: (build) => ({
    fetchLot: build.query({
      query: (id) => ({
        url: `/lot/${id}`
      }),
      providesTags: result => ['Lot']
    }),
    getBets: build.query({
      query: (id) =>  ({
        url: `/lot/${id}/bets`
      }),
      providesTags: result => ['Bets']
    }),
    getOffers: build.query({
      query: (id) =>  ({
        url: `/lot/${id}/offers`
      }),
      providesTags: result => ['Offers']
    }),
    fetchCategories: build.query({
      query: () => ({
        url: '/lot/categories',
        method: 'POST',
        body: {
          id: null
        }
      }),
      providesTags: result => ['Categories'],
    }),
    fetchSubcategories: build.query({
      query: ({id}) => ({
        url: '/lot/categories',
        method: 'POST',
        body: {
          id: id
        }
      }),
      providesTags: result => ['Subcategories'],
    }),
    fetchFilters: build.query({
      query: ({id}) =>  ({
        url: `/lot/categories/${id}/filters`
      }),
      providesTags: result => ['Features']
    }),
    fetchDefaultFilters: build.query({
      query: () => ({
        url: "/lot/filters"
      })
    }),
    fetchLots: build.query({
      query: (body) => ({
        url: '/lot/lots',
        method: 'POST',
        body
      }),
      providesTags: result => ['Lots'],
    }),
    createLot: build.mutation({
      query: (body) => ({
        url: '/lot',
        method: 'POST',
        body
      }),
      invalidatesTags: ['Lots']
    })
  }),
})