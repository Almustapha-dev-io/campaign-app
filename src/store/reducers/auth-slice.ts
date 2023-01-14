import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { changePassword, logIn } from 'api/auth';
import { uploadVoters } from 'api/voters';
import { toast } from 'react-toastify';
import { TUser } from 'types/user';

type TAuthState = {
  accessToken: string;
  userDetails: TUser;
  status: 'idle' | 'pending';
  error: string;
  uploadSuccess?: boolean;
};

const initialState: Partial<TAuthState> & { status: 'idle' | 'pending' } = {
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startTask(state) {
      state.status = 'pending';
    },
    logOut(state) {
      delete state.accessToken;
      delete state.userDetails;
    },
    setAuth(
      state,
      {
        payload,
      }: PayloadAction<Pick<TAuthState, 'accessToken' | 'userDetails'>>
    ) {
      state.accessToken = payload.accessToken;
      state.userDetails = payload.userDetails;
    },
    reset(state) {
      delete state.error;
      delete state.uploadSuccess;
      state.status = 'idle';
    },
    setUserImage(state, { payload }: PayloadAction<string>) {
      if (state.userDetails) {
        state.userDetails.profilePictureUrl = payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logIn.fulfilled, (state, { payload }) => {
      state.status = 'idle';
      state.error = '';
      state.accessToken = payload.access_token;
      state.userDetails = payload.userInfo;
    });

    builder.addCase(logIn.rejected, (state, { payload }) => {
      state.error = payload as string;
      state.status = 'idle';
    });

    builder.addCase(changePassword.fulfilled, (state) => {
      toast('Password changed successfully. Please login', { type: 'success' });
      state.status = 'idle';
      state.error = '';
      delete state.accessToken;
      delete state.userDetails;
    });

    builder.addCase(changePassword.rejected, (state, { payload }) => {
      state.error = payload as string;
      state.status = 'idle';
    });

    builder.addCase(uploadVoters.fulfilled, (state) => {
      toast('Voters uploaded successfully!', { type: 'success' });
      state.status = 'idle';
      state.uploadSuccess = true;
    });

    builder.addCase(uploadVoters.rejected, (state, { payload }) => {
      toast(payload as string, { type: 'error' });
      state.status = 'idle';
      state.error = payload as string;
      state.uploadSuccess = false;
    });
  },
});

export const { logOut, startTask, reset, setUserImage, setAuth } =
  authSlice.actions;

export default authSlice.reducer;
