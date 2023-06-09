import { createApi } from '@reduxjs/toolkit/dist/query/react'
import baseQuery from './customBaseQuery'

export const lotApi = createApi({ 
  reducerPath: 'lotAPI',
  baseQuery: baseQuery,
  tagTypes: ['Lot', 'Bets', 'Offers', 'Categories', 'Subcategories', 'Features', 'Lots', 'UserLotsAmounts', 'AllLots', 'FutureLots', 'OrderedLots', 'SoldLots', 'ActiveLots', 'ActiveAuctions', 'Buyed', 'Ordered', 'AllCurrentLots', 'AllCurrentLotsAmount'],
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
      invalidatesTags: ['Lots', 'UserLotsAmounts']
    }),
    updateLot: build.mutation({
      query: ({id, body}) => ({
        url: `/lot/${id}`,
        method: 'PUT',
        body
      }),
      invalidatesTags: ['Lots', 'Lot']
    }),
    getAllAmounts: build.query({
      query: () => ({
        url: '/lot/amounts'
      }),
      providesTags: result => ['UserLotsAmounts'],
    }),
    getUsersAllLots: build.query({
      query: (body) => ({
        url: '/lot/alllots/alllots',
        method: 'POST',
        body
      }),
      providesTags: result => ['AllLots'],
    }),
    getUsersFutureLots: build.query({
      query: (body) => ({
        url: '/lot/alllots/futurelots',
        method: 'POST',
        body
      }),
      providesTags: result => ['FutureLots'],
    }),
    getUsersActiveLots: build.query({
      query: (body) => ({
        url: '/lot/alllots/activelots',
        method: 'POST',
        body
      }),
      providesTags: result => ['ActiveLots'],
    }),
    getUsersSoldLots: build.query({
      query: (body) => ({
        url: '/lot/alllots/soldlots',
        method: 'POST',
        body
      }),
      providesTags: result => ['SoldLots'],
    }),
    getUsersOrderedLots: build.query({
      query: (body) => ({
        url: '/lot/alllots/orderedlots',
        method: 'POST',
        body
      }),
      providesTags: result => ['OrderedLots'],
    }),
    getUsersActiveAuctions: build.query({
      query: (body) => ({
        url: '/lot/alllots/activeauctions',
        method: 'POST',
        body
      }),
      providesTags: result => ['ActiveAuctions'],
    }),
    getUsersBuyed: build.query({
      query: (body) => ({
        url: '/lot/alllots/buyed',
        method: 'POST',
        body
      }),
      providesTags: result => ['Buyed'],
    }),
    getUsersOrdered: build.query({
      query: (body) => ({
        url: '/lot/alllots/ordered',
        method: 'POST',
        body
      }),
      providesTags: result => ['Ordered'],
    }),
    getUsersAllCurrentLots: build.query({
      query: ({id, body}) => ({
        url: `/lot/user/${id}`,
        method: 'POST',
        body
      }),
      providesTags: result => ['AllCurrentLots'],
    }),
    getUsersAllCurrentLotsAmount: build.query({
      query: ({id, body}) => ({
        url: `/lot/user/${id}/amount`,
        method: 'POST',
        body
      }),
      providesTags: result => ['AllCurrentLotsAmount'],
    }),
  }),
})