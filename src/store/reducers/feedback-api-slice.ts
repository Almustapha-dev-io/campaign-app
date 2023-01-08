import { createApi } from '@reduxjs/toolkit/query/react';
import { FeedbackChannels, FeedbackDTO, TFeedback } from 'types/feedback';
import { TPagination, TPaginationResponse } from 'types/paginaiton';
import { apiBaseURL } from 'utilities/env';
import getBaseQueryWithLogout from 'utilities/getBaseQueryWithLogout';

type TFeedbackResponse = TPaginationResponse<TFeedback>;

export const feedbackApiSlice = createApi({
  reducerPath: 'feedbackApi',
  tagTypes: ['Feedback'],
  baseQuery: getBaseQueryWithLogout(`${apiBaseURL}/feedbacks`),
  endpoints: (build) => ({
    getFeedbacks: build.query<
      TFeedbackResponse & Record<'pages', number>,
      TPagination & { channel?: string }
    >({
      query: ({ page = 0, size = 10, sortBy = 'id', channel }) =>
        `/?page=${page}&size=${size}&sortBy=${sortBy}${
          channel ? `&channel=${channel}` : ''
        }`,
      transformResponse: (response: TFeedbackResponse, _, { size = 10 }) => {
        return { ...response, pages: Math.ceil(response.total / size) };
      },
      providesTags: ['Feedback'],
    }),

    getFeedbackAnalysis: build.query<
      {
        channel: FeedbackChannels;
        total: number;
      }[],
      void
    >({
      query: () => '/analysis',
    }),

    addFeedback: build.mutation<TFeedback, FeedbackDTO>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Feedback'],
    }),

    updateFeedback: build.mutation<TFeedback, FeedbackDTO>({
      query: (body) => ({
        url: '/',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Feedback'],
    }),
  }),
});

export const {
  useGetFeedbacksQuery,
  useLazyGetFeedbacksQuery,
  useAddFeedbackMutation,
  useUpdateFeedbackMutation,
  useGetFeedbackAnalysisQuery,
} = feedbackApiSlice;
