import { createApi } from '@reduxjs/toolkit/dist/query/react'
import baseQuery from './customBaseQuery'

export const userApi = createApi({ 
  reducerPath: 'userAPI',
  baseQuery: baseQuery,
  tagTypes: ['User'],
  endpoints: (build) => ({
    fetchUser: build.query({
      query: (id) => ({
        url: `/user/${id}`
      }),
      providesTags: result => ['User']
    }),
    updateUser: build.mutation({
      query: ({id, body}) => ({
        url: `/user/${id}`,
        method: 'PATCH',
        body: body
      }),
      invalidatesTags: ['User']
    })
  })
})