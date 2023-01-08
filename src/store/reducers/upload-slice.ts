import { createSlice } from '@reduxjs/toolkit';
import { uploadFile } from 'api/cloudinary';

type TUploadState = {
  status: 'idle' | 'pending';
  uploadURL: string;
  error: string;
};

const initialState: TUploadState = {
  status: 'idle',
  uploadURL: '',
  error: '',
};

const fileUploadSlice = createSlice({
  name: 'fileUploads',
  initialState,
  reducers: {
    startTask(state) {
      state.status = 'pending';
    },
    endTask(state) {
      state.status = 'idle';
    },
    resetData(state) {
      state.status = 'idle';
      state.error = '';
      state.uploadURL = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadFile.fulfilled, (state, { payload }) => {
      state.status = 'idle';
      state.uploadURL = payload;
      state.error = '';
    });

    builder.addCase(uploadFile.rejected, (state, { payload }) => {
      state.status = 'idle';
      state.uploadURL = '';
      state.error = payload as string;
    });
  },
});

export const { endTask, startTask, resetData } = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
