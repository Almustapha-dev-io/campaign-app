import { createApi } from '@reduxjs/toolkit/query/react';
import { TPaginationResponse } from 'types/paginaiton';
import { TPollingUnit } from 'types/polling-unit';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

export const pollingUnitApiSlice = createApi({
  reducerPath: 'pollingUnitApi',
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/polling-units`),
  endpoints: (build) => ({
    getPollingUnits: build.query<TPollingUnit[], number>({
      query: (wardId) => `?wardId=${wardId}&page=0&size=10000`,
      transformResponse: (res: TPaginationResponse<TPollingUnit>) => {
        console.log({ data: res.data });
        return res.data;
      },
    }),
  }),
});

export const { useGetPollingUnitsQuery, useLazyGetPollingUnitsQuery } =
  pollingUnitApiSlice;
