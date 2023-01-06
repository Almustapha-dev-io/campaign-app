import { createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { RootState } from 'store';
import { LoginDTO, TLoginServerResponse } from 'types/user';
import { apiAxios } from 'utilities/axios-instance';
import { getAuthServerErrorMessage } from 'utilities/getServerErrorMessage';

export const logIn = createAsyncThunk(
  'auth/loginRequest',
  async (data: LoginDTO, thunkApi) => {
    const config: AxiosRequestConfig = {
      params: {
        grant_type: 'password',
        ...data,
      },
      headers: {
        Authorization: `Basic ${btoa('web:web')}`,
      },
    };

    try {
      const response: AxiosResponse<TLoginServerResponse> = await apiAxios.post(
        '/oauth/token',
        {},
        config
      );
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue(getAuthServerErrorMessage(error));
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (password: string, { getState, rejectWithValue }) => {
    const {
      auth: { accessToken },
    } = getState() as RootState;
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await apiAxios.put(
        '/users/password-change',
        { password },
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
