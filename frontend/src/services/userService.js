import { createApi } from '@reduxjs/toolkit/dist/query/react'
import baseQuery from './customBaseQuery'

export const userApi = createApi({ 
  reducerPath: 'userAPI',
  baseQuery: baseQuery,
  endpoints: (build) => ({
    fetchUser: build.query({
      query: (id) => ({
        url: `/user/${id}`
      })
    }),
    updateUser: build.mutation({
      query: (id, body) => ({
        url: `/user/${id}`,
        method: 'POST',
        body: body
      })
    })
  })
})