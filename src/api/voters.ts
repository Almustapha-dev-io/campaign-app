import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import { RootState } from 'store';
import { UploadVotersDTO } from 'types/voter';
import { apiAxios } from 'utilities/axios-instance';
import getServerErrorMessage from 'utilities/getServerErrorMessage';

export const uploadVoters = createAsyncThunk(
  'voters/uploadVoters',
  async (data: UploadVotersDTO, { getState, rejectWithValue }) => {
    const {
      auth: { accessToken },
    } = getState() as RootState;
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('wardId', data.wardId);
    formData.append('electionTypeId', data.electionTypeId);

    try {
      const response = await apiAxios.post('/voters/upload', formData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(getServerErrorMessage(error));
    }
  }
);
