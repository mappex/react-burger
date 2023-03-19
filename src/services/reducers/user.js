/* eslint-disable no-param-reassign */
import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  fetchAuthLogin as apiAuthLogin,
  fetchAuthLogout as apiAuthLogout,
  fetchAuthTokens as apiAuthTokens,
  fetchAuthRegister as apiAuthRegister,
  fetchAuthUserData as apiAuthUserDataUpdate,
  fetchAuthUserDataUpdate as apiUpdateUserData,
  fetchPasswordResetForEmail as apiPasswordResetForEmail,
  fetchPasswordNew as apiPasswordNew,
} from '../api';

import {
  setUser,
  resetUser,
  getRefreshToken,
  getAccessSchemaAndToken,
  authenticationSideEffect,
  cleanUpAuthenticationSideEffect,
} from '../helpers';

export const PasswordResettingPhase = {
  initial: 'initial',
  requestingApprovalCode: 'requesting-approval-code',
  requestingCredentialsFromUser: 'requesting-credentials-from-user',
  pendingResetting: 'pending-resetting',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

export const UserRegistrationPhase = {
  initial: 'initial',
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

export const UserLoginPhase = {
  initial: 'initial',
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

export const UpdateUserDataPhase = {
  initial: 'initial',
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

export const AutoLoginPhase = {
  initial: 'initial',
  pending: 'pending',
  fulfilled: 'fulfilled',
  rejected: 'rejected',
};

const initialState = {
  autoLoginPhase: AutoLoginPhase.initial,
  passwordResettingPhase: PasswordResettingPhase.initial,
  userLoginPhase: UserLoginPhase.initial,
  userRegistrationPhase: UserRegistrationPhase.initial,
  updateUserDataPhase: UpdateUserDataPhase.initial,
};

export const doAutoLogin = createAsyncThunk('user/doAutoLogin', async () => {
  const { accessSchema, accessToken } = getAccessSchemaAndToken();

  if (!accessSchema || !accessToken) {
    throw new Error('Action cannot be handled');
  }

  try {
    return await apiAuthUserDataUpdate({ auth: { accessSchema, accessToken } });
  } catch (error) {
    if (error.message !== 'jwt expired') {
      throw error;
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw error;
    }

    const payload = await apiAuthTokens({ refreshToken });

    authenticationSideEffect(payload);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { accessSchema, accessToken } = getAccessSchemaAndToken();

    return apiAuthUserDataUpdate({
      auth: {
        accessSchema,
        accessToken,
      },
    });
  }
});

export const login = createAsyncThunk('user/login', apiAuthLogin);

export const logout = createAsyncThunk('user/logout', () => {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    return apiAuthLogout({ refreshToken: refreshToken });
  }
});

export const registerUser = createAsyncThunk(
  'user/registerUser',
  apiAuthRegister,
);

export const requestNewPasswordSetting = createAsyncThunk(
  'user/requestNewPasswordSetting',
  apiPasswordNew,
);

export const requestPasswordResettingForEmail = createAsyncThunk(
  'user/requestPasswordResettingForEmail',
  apiPasswordResetForEmail,
);

export const updateUserData = createAsyncThunk('user/updateUserData', async ({ email, name, password }) => {
  const { accessSchema, accessToken } = getAccessSchemaAndToken();

  if (!accessSchema || !accessToken) {
    throw new Error('Action cannot be handled');
  }

  try {
    return await apiUpdateUserData({
      auth: {
        accessSchema,
        accessToken,
      },
      data: {
        email,
        name,
        password,
      },
    });
  } catch (error) {
    if (error.message !== 'jwt expired') {
      throw error;
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw error;
    }

    const payload = await apiAuthTokens({ refreshToken });

    authenticationSideEffect(payload);

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { accessSchema, accessToken } = getAccessSchemaAndToken();

    return apiUpdateUserData({
      auth: { accessSchema, accessToken },
      data: { email, name, password },
    });
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    interruptPasswordResettingWorkflow(state) {
      state.passwordResettingPhase = PasswordResettingPhase.initial;
    },
    interruptUpdateUserData(state) {
      state.updateUserDataPhase = UpdateUserDataPhase.initial;
    },
    interruptUserLogin(state) {
      state.userLoginPhase = UserLoginPhase.initial;
    },
    interruptUserRegistration(state) {
      state.userRegistrationPhase = UserRegistrationPhase.initial;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordResettingForEmail.pending, (state) => {
        state.passwordResettingPhase = PasswordResettingPhase.requestingApprovalCode;
      })
      .addCase(requestPasswordResettingForEmail.fulfilled, (state) => {
        state.passwordResettingPhase = PasswordResettingPhase.requestingCredentialsFromUser;
      })
      .addCase(requestPasswordResettingForEmail.rejected, (state) => {
        state.passwordResettingPhase = PasswordResettingPhase.initial;
      });

    builder
      .addCase(requestNewPasswordSetting.pending, (state) => {
        state.passwordResettingPhase = PasswordResettingPhase.pendingResetting;
      })
      .addCase(requestNewPasswordSetting.fulfilled, (state) => {
        state.passwordResettingPhase = PasswordResettingPhase.fulfilled;
      })
      .addCase(requestNewPasswordSetting.rejected, (state) => {
        state.passwordResettingPhase = PasswordResettingPhase.rejected;
      });

    builder
      .addCase(registerUser.pending, (state) => {
        state.userRegistrationPhase = UserRegistrationPhase.pending;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        authenticationSideEffect(payload);
        state.userRegistrationPhase = UserRegistrationPhase.fulfilled;
        setUser(state, payload.user);
      })
      .addCase(registerUser.rejected, (state) => {
        state.userRegistrationPhase = UserRegistrationPhase.rejected;
      });

    builder
      .addCase(login.pending, (state) => {
        state.userLoginPhase = UserLoginPhase.pending;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        authenticationSideEffect(payload);
        state.userLoginPhase = UserLoginPhase.fulfilled;
        setUser(state, payload.user);
      })
      .addCase(login.rejected, (state) => {
        state.userLoginPhase = UserLoginPhase.rejected;
      });

    builder
      .addCase(logout.pending, () => {})
      .addCase(logout.fulfilled, (state) => {
        cleanUpAuthenticationSideEffect();
        resetUser(state);
        state.userLoginPhase = UserLoginPhase.initial;
      })
      .addCase(logout.rejected, () => {});

    builder
      .addCase(updateUserData.pending, (state) => {
        state.updateUserDataPhase = UpdateUserDataPhase.pending;
      })
      .addCase(updateUserData.fulfilled, (state, { payload }) => {
        setUser(state, payload.user);
        state.updateUserDataPhase = UpdateUserDataPhase.fulfilled;
      })
      .addCase(updateUserData.rejected, (state) => {
        state.updateUserDataPhase = UpdateUserDataPhase.rejected;
      });

    builder
      .addCase(doAutoLogin.pending, (state) => {
        state.autoLoginPhase = AutoLoginPhase.pending;
      })
      .addCase(doAutoLogin.fulfilled, (state, { payload }) => {
        state.autoLoginPhase = AutoLoginPhase.fulfilled;
        state.userLoginPhase = UserLoginPhase.fulfilled;
        setUser(state, payload);
      })
      .addCase(doAutoLogin.rejected, (state) => {
        state.autoLoginPhase = AutoLoginPhase.rejected;
      });
  },
});

export const {
  interruptUserLogin,
  interruptUpdateUserData,
  interruptUserRegistration,
  interruptPasswordResettingWorkflow,
} = userSlice.actions;

export default userSlice.reducer;

