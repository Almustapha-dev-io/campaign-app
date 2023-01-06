import { createApi } from '@reduxjs/toolkit/query/react';
import { TPagination, TPaginationResponse } from 'types/paginaiton';
import { TVoter, VoterResponseDTO } from 'types/voter';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

type TVotersResponse = TPaginationResponse<TVoter>;

export const votersApiSlice = createApi({
  reducerPath: 'votersApiSlice',
  tagTypes: ['Voters'],
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/voters`),
  endpoints: (build) => ({
    getVoters: build.query<
      TVotersResponse & Record<'pages', number>,
      TPagination & Record<'wardId', string>
    >({
      query: ({ page = 0, size = 10, sortBy = 'id', wardId }) =>
        `/?page=${page}&size=${size}&sortBy=${sortBy}&wardId=${wardId}`,
      providesTags: ['Voters'],
      transformResponse: (response: TVotersResponse, _, { size = 10 }) => {
        return { ...response, pages: Math.ceil(response.total / size) };
      },
    }),

    getVotersAnalytics: build.query<
      {
        status: 'PENDING' | 'DONE';
        votedParty: 'PDP' | 'APC' | 'OTHERS';
        total: number;
      }[],
      void
    >({
      query: () => '/analytics',
    }),

    addVoterResponse: build.mutation<TVoter, VoterResponseDTO>({
      query: (body) => ({
        url: '/responses',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Voters'],
    }),
  }),
});

export const {
  useGetVotersQuery,
  useLazyGetVotersQuery,
  useGetVotersAnalyticsQuery,
  useAddVoterResponseMutation,
} = votersApiSlice;
