import { createApi } from '@reduxjs/toolkit/query/react';
import { TPagination, TPaginationResponse } from 'types/paginaiton';
import { TVote, VoteDTO } from 'types/vote';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

type TVoteResponse = TPaginationResponse<TVote>;

export const votesApiSlice = createApi({
  reducerPath: 'votesApi',
  tagTypes: ['Vote'],
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/votes`),
  endpoints: (build) => ({
    getVotes: build.query<
      TVoteResponse & Record<'pages', number>,
      TPagination & Record<'wardId', string>
    >({
      query: ({ page = 0, size = 10, sortBy = 'id', wardId }) =>
        `/?page=${page}&size=${size}&sortBy=${sortBy}&wardId=${wardId}`,
      transformResponse: (response: TVoteResponse, _, { size = 10 }) => {
        return { ...response, pages: Math.ceil(response.total / size) };
      },
      providesTags: ['Vote'],
    }),

    addVote: build.mutation<TVote, VoteDTO>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Vote'],
    }),

    updateVote: build.mutation<TVote, VoteDTO>({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Vote'],
    }),
  }),
});

export const {
  useAddVoteMutation,
  useGetVotesQuery,
  useLazyGetVotesQuery,
  useUpdateVoteMutation,
} = votesApiSlice;
