import { createApi } from '@reduxjs/toolkit/query/react';
import { TPagination, TPaginationResponse } from 'types/paginaiton';
import { TPoliticalParty } from 'types/political-party';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

type TPartiesResponse = TPaginationResponse<TPoliticalParty>;

export const politcalPartyApiSlice = createApi({
  reducerPath: 'politicalPartyApi',
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/parties`),
  tagTypes: ['Party'],
  endpoints: (build) => ({
    addParty: build.mutation<TPoliticalParty, TPoliticalParty>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Party'],
    }),

    updateParty: build.mutation<TPoliticalParty, TPoliticalParty>({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Party'],
    }),

    getPoliticalParty: build.query<
      TPartiesResponse & Record<'pages', number>,
      TPagination
    >({
      query: ({ page = 0, size = 10, sortBy = 'id' }) =>
        `/?page=${page}&size=${size}&sortBy=${sortBy}`,
      providesTags: ['Party'],
      transformResponse: (response: TPartiesResponse, _, { size = 10 }) => {
        return { ...response, pages: Math.ceil(response.total / size) };
      },
    }),
  }),
});

export const {
  useAddPartyMutation,
  useUpdatePartyMutation,
  useGetPoliticalPartyQuery,
  useLazyGetPoliticalPartyQuery,
} = politcalPartyApiSlice;
