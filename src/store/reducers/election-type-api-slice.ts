import { createApi } from '@reduxjs/toolkit/query/react';
import { ElectionTypeDTO, TElectionType } from 'types/election-type';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

export const electionTypeApiSlice = createApi({
  reducerPath: 'electionTypesApi',
  tagTypes: ['ElectionTypes'],
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/election-types`),
  endpoints: (build) => ({
    getElectionTypes: build.query<TElectionType[], void>({
      query: () => '/',
      providesTags: ['ElectionTypes'],
    }),
    addElectionType: build.mutation<TElectionType, ElectionTypeDTO>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['ElectionTypes'],
    }),
    updateElectionType: build.mutation<TElectionType, Partial<TElectionType>>({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['ElectionTypes'],
    }),
  }),
});

export const {
  useAddElectionTypeMutation,
  useGetElectionTypesQuery,
  useLazyGetElectionTypesQuery,
  useUpdateElectionTypeMutation,
} = electionTypeApiSlice;
