import { createApi } from '@reduxjs/toolkit/dist/query/react'
import baseQuery from './customBaseQuery'

export const orderApi = createApi({ 
  reducerPath: 'orderAPI',
  baseQuery: baseQuery,
  tagTypes: ['Wins'],
  endpoints: (build) => ({
    fetchWins: build.query({
      query: (id) => ({
        url: `/order/wins/${id}`
      }),
      providesTags: result => ['Wins']
    }),
  }),
})