import { createApi } from '@reduxjs/toolkit/query/react';
import { TAddUserFormValues } from 'form-schemas/user';
import { TPagination, TPaginationResponse } from 'types/paginaiton';
import { TUser, TUserAnalyticsResponse } from 'types/user';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

type TUserResponse = TPaginationResponse<TUser>;

type TAddUserDTO = Omit<TAddUserFormValues, 'roleIds' | 'lgaId'> & {
  roleIds: number[];
  password?: string;
};

const usersApiSlice = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['User', 'UserAnalytics'],
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/users`),
  endpoints: (build) => ({
    getUsers: build.query<TUserResponse & Record<'pages', number>, TPagination>(
      {
        query: ({ page = 0, size = 10, sortBy = 'id' }) =>
          `/?page=${page}&size=${size}&sortBy=${sortBy}`,
        providesTags: ['User'],
        transformResponse: (response: TUserResponse, _, { size = 10 }) => {
          return { ...response, pages: Math.ceil(response.total / size) };
        },
      }
    ),

    getUserAnalytics: build.query<TUserAnalyticsResponse[], void>({
      query: () => '/analytics',
      providesTags: ['UserAnalytics'],
    }),

    addUser: build.mutation<any, TAddUserDTO>({
      query: (body) => ({
        url: '/registration',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'UserAnalytics'],
    }),

    disableUser: build.mutation<any, string>({
      query: (email) => ({
        url: `/disable-user?email=${email}`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),

    enableUser: build.mutation<any, string>({
      query: (email) => ({
        url: `/enable-user?email=${email}`,
        method: 'PUT',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useAddUserMutation,
  useDisableUserMutation,
  useGetUserAnalyticsQuery,
  useEnableUserMutation,
} = usersApiSlice;

export default usersApiSlice;
