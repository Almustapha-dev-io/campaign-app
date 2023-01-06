import { createApi } from '@reduxjs/toolkit/query/react';
import { TRole } from 'types/roles';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

const rolesApiSlice = createApi({
  reducerPath: 'routeApi',
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/roles`),
  endpoints: (build) => ({
    getRoles: build.query<TRole[], void>({
      query: () => '/',
    }),
  }),
});

export const { useGetRolesQuery, useLazyGetRolesQuery } = rolesApiSlice;
export default rolesApiSlice;
