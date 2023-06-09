import { createApi } from '@reduxjs/toolkit/dist/query/react'
import baseQuery from './customBaseQuery'

export const orderApi = createApi({ 
  reducerPath: 'orderAPI',
  baseQuery: baseQuery,
  tagTypes: ['Wins', 'LotCheckout', 'Amount', 'Bought', 'Sold'],
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
    }),
    getOrdersAmount: build.query({
      query: () => ({
        url: `/order/allorders/amount`
      }),
      providesTags: result => ['Amount']
    }),
    getBought: build.query({
      query: (body) => ({
        url: `/order/allorders/bought`,
        method: 'POST',
        body
      }),
      providesTags: result => ['Bought']
    }),
    getSold: build.query({
      query: (body) => ({
        url: `/order/allorders/sold`,
        method: 'POST',
        body
      }),
      providesTags: result => ['Sold']
    }),
    changeOrderStatus: build.mutation({
      query: ({id, body}) => ({
        url: `/order/${id}/status`,
        method: 'PATCH',
        body
      }),
    })
  }),
})