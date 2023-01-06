import { createApi } from '@reduxjs/toolkit/query/react';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

export const wardsApiSlice = createApi({
  reducerPath: 'wardsApi',
  tagTypes: ['Wards'],
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/`),
  endpoints: (build) => ({}),
});
