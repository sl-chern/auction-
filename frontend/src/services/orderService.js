import { createApi } from '@reduxjs/toolkit/dist/query/react'
import baseQuery from './customBaseQuery'

export const orderApi = createApi({ 
  reducerPath: 'orderAPI',
  baseQuery: baseQuery,
  tagTypes: ['Wins', 'LotCheckout'],
  endpoints: (build) => ({
    fetchWins: build.query({
      query: (id) => ({
        url: `/order/wins/${id}`
      }),
      providesTags: result => ['Wins']
    }),
    fetchLotCheckoutInfo: build.query({
      query: (id) => ({
        url: `/order/lot/${id}`
      }),
      providesTags: result => ['LotCheckout']
    }),
    createOrder: build.mutation({
      query: ({id, body}) => ({
        url: `/order/lot/${id}`,
        method: 'POST',
        body: body
      })
    })
  }),
})