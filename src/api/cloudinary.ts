import { createAsyncThunk } from '@reduxjs/toolkit';
import { startTask } from 'store/reducers/upload-slice';
import { cloudinaryApiAxios } from 'utilities/axios-instance';
import { cloudinaryCloudName, cloudinaryPreset } from 'utilities/env';
import getServerErrorMessage from 'utilities/getServerErrorMessage';

export const uploadFile = createAsyncThunk(
  'fileUpload/uploadFile',
  async (file: File, thunkApi) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', cloudinaryPreset);
    fd.append('cloud_name', cloudinaryCloudName);

    try {
      thunkApi.dispatch(startTask());
      const response = await cloudinaryApiAxios.post('/', fd);
      return response.data.url as string;
    } catch (err) {
      return thunkApi.rejectWithValue(getServerErrorMessage(err));
    }
  }
);
