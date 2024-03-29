import { createApi } from '@reduxjs/toolkit/query/react';
import { TPagination, TPaginationResponse } from 'types/paginaiton';
import {
  PollingUnitDTO,
  PollingUnitIssueDTO,
  TPollingUnit,
  TPollingUnitIssue,
} from 'types/polling-unit';

import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

type TPollingUniIssuetResponse = TPaginationResponse<TPollingUnitIssue>;
type TPollingUnitIssuesAnalyticsResponse = {
  pollingUnitId: number;
  pollingUnitName: string;
  totalIssues: number;
};

export const pollingUnitApiSlice = createApi({
  reducerPath: 'pollingUnitApi',
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/polling-units`),
  tagTypes: ['Units'],
  endpoints: (build) => ({
    getPollingUnits: build.query<TPollingUnit[], number>({
      query: (wardId) => `?wardId=${wardId}&page=0&size=10000`,
      transformResponse: (res: TPaginationResponse<TPollingUnit>) => {
        return res.data;
      },
      providesTags: ['Units'],
    }),

    addIssue: build.mutation<any, PollingUnitIssueDTO>({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
    }),

    updateUnit: build.mutation<any, PollingUnitDTO>({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Units'],
    }),

    getIssues: build.query<
      TPollingUniIssuetResponse & Record<'pages', number>,
      TPagination & Record<'pollingUnitId', string>
    >({
      query: ({ page = 0, size = 10, sortBy = 'id', pollingUnitId }) =>
        `/issues?page=${page}&size=${size}&sortBy=${sortBy}&pollingUnitId=${pollingUnitId}`,
      transformResponse: (
        response: TPollingUniIssuetResponse,
        _,
        { size = 10 }
      ) => {
        return { ...response, pages: Math.ceil(response.total / size) };
      },
    }),

    getIssuesAnalytics: build.query<
      TPollingUnitIssuesAnalyticsResponse,
      string
    >({
      query: (id) => `/issues/analytics?pollingUnitId=${id}`,
    }),
  }),
});

export const {
  useGetPollingUnitsQuery,
  useLazyGetPollingUnitsQuery,
  useAddIssueMutation,
  useGetIssuesQuery,
  useLazyGetIssuesQuery,
  useUpdateUnitMutation,
  useGetIssuesAnalyticsQuery,
  useLazyGetIssuesAnalyticsQuery,
} = pollingUnitApiSlice;
