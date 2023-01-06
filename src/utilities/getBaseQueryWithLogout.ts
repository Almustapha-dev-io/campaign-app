/* eslint-disable @typescript-eslint/indent */
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { RootState } from 'store';

import { toast } from 'react-toastify';
import { logOut } from 'store/reducers/auth-slice';

const getBaseQueryWithLogout = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders(headers, { getState }) {
      const {
        auth: { accessToken },
      } = getState() as RootState;
      headers.set('Authorization', `Bearer ${accessToken}`);
      return headers;
    },
  });

  const baseQueryWithLogout: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
  > = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
      toast('Your session expired!', {
        type: 'error',
        toastId: 'session-expired',
      });
      api.dispatch(logOut());
    }
    return result;
  };

  return baseQueryWithLogout;
};

export default getBaseQueryWithLogout;
