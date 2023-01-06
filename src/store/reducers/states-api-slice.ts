import { createApi } from '@reduxjs/toolkit/query/react';
import { TPaginationResponse } from 'types/paginaiton';
import { TLocalGovernment, TWard } from 'types/ward';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

export const statesApiSlice = createApi({
  reducerPath: 'statesApi',
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/states`),
  endpoints: (build) => ({
    getLGAs: build.query<TLocalGovernment[], void>({
      query: () => `/lga?stateId=1&page=0&size=10000`,
      transformResponse: (response: TPaginationResponse<TLocalGovernment>) =>
        response.data,
    }),

    getWards: build.query<TWard[], string>({
      query: (lga) => `/lga/wards?lgaId=${lga}&page=0&size=10000`,
      transformResponse: (response: TPaginationResponse<TWard>) =>
        response.data,
    }),
  }),
});

export const {
  useGetLGAsQuery,
  useGetWardsQuery,
  useLazyGetLGAsQuery,
  useLazyGetWardsQuery,
} = statesApiSlice;
