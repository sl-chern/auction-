import { createApi } from '@reduxjs/toolkit/dist/query/react'
import baseQuery from './customBaseQuery'

export const lotApi = createApi({ 
  reducerPath: 'lotAPI',
  baseQuery: baseQuery,
  tagTypes: ['Lot', 'Bets', 'Offers'],
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
    })
  }),
})