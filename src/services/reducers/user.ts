import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  User,
  IUserResponse,
  TAuthUserResponse,
  IRefreshTokensResponse,
} from '../../utils/types';
import {
  IAuthLoginRequestParams,
  IAuthRegisterRequestParams,
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

export enum PasswordResettingPhase {
  initial = 'initial',
  requestingApprovalCode = 'requesting-approval-code',
  requestingCredentialsFromUser = 'requesting-credentials-from-user',
  pendingResetting = 'pending-resetting',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export enum UserRegistrationPhase {
  initial = 'initial',
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export enum UserLoginPhase {
  initial = 'initial',
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export enum UpdateUserDataPhase {
  initial = 'initial',
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export enum AutoLoginPhase {
  initial = 'initial',
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}


export const initialState: Readonly<{
  accessToken?: string;
  autoLoginPhase: AutoLoginPhase;
  passwordResettingPhase: PasswordResettingPhase;
  refreshToken?: string;
  user?: User;
  userLoginPhase: UserLoginPhase;
  userRegistrationPhase: UserRegistrationPhase;
  userTimeStamp?: number;
  updateUserDataPhase: UpdateUserDataPhase;
}> = {
  autoLoginPhase: AutoLoginPhase.initial,
  passwordResettingPhase: PasswordResettingPhase.initial,
  userLoginPhase: UserLoginPhase.initial,
  userRegistrationPhase: UserRegistrationPhase.initial,
  updateUserDataPhase: UpdateUserDataPhase.initial,
};

export type TInitialState = typeof initialState;

export const doAutoLogin = createAsyncThunk('user/doAutoLogin', async () => {
  const { accessSchema, accessToken } = getAccessSchemaAndToken();

  if (!accessSchema || !accessToken) {
    throw new Error('Action cannot be handled');
  }

  try {
    return await apiAuthUserDataUpdate({ auth: { accessSchema, accessToken } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message !== 'jwt expired') {
      throw error;
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw error;
    }

    const payload = await apiAuthTokens({ refreshToken });

    authenticationSideEffect(payload);

    const {
      accessSchema: accessSchemaRepeat,
      accessToken: accessTokenRepeat,
    } = getAccessSchemaAndToken() as Pick<IRefreshTokensResponse, 'accessSchema' | 'accessToken'>;

    return apiAuthUserDataUpdate({
      auth: {
        accessSchema: accessSchemaRepeat,
        accessToken: accessTokenRepeat,
      },
    });
  }
});

export const login = createAsyncThunk('user/login', async (params: IAuthLoginRequestParams) => {
  const result = await apiAuthLogin(params);

  authenticationSideEffect(result);

  return result;
});

export const logout = createAsyncThunk('user/logout', async () => {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    await apiAuthLogout({ refreshToken: refreshToken });

    cleanUpAuthenticationSideEffect();
  }
});

export const registerUser = createAsyncThunk('user/registerUser', async (params: IAuthRegisterRequestParams) => {
  const result = await apiAuthRegister(params);

  authenticationSideEffect(result);

  return result;
});

export const requestNewPasswordSetting = createAsyncThunk('user/requestNewPasswordSetting', apiPasswordNew);

export const requestPasswordResettingForEmail = createAsyncThunk(
  'user/requestPasswordResettingForEmail',
  apiPasswordResetForEmail,
);

export const updateUserData = createAsyncThunk('user/updateUserData', async ({
  email,
  name,
  password,
}: {
  email: string;
  name: string;
  password: string;
}) => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message !== 'jwt expired') {
      throw error;
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw error;
    }

    const payload = await apiAuthTokens({ refreshToken });

    authenticationSideEffect(payload);

    const {
      accessSchema: accessSchemaRepeat,
      accessToken: accessTokenRepeat,
    } = getAccessSchemaAndToken() as Pick<IRefreshTokensResponse, 'accessSchema' | 'accessToken'>;

    return apiUpdateUserData({
      auth: {
        accessSchema: accessSchemaRepeat,
        accessToken: accessTokenRepeat,
      },
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
      .addCase(registerUser.fulfilled, (state, { payload }: PayloadAction<TAuthUserResponse>) => {
        state.userRegistrationPhase = UserRegistrationPhase.fulfilled;
        state.userLoginPhase = UserLoginPhase.fulfilled;
        setUser(state, payload.user);
      })
      .addCase(registerUser.rejected, (state) => {
        state.userRegistrationPhase = UserRegistrationPhase.rejected;
      });

    builder
      .addCase(login.pending, (state) => {
        state.userLoginPhase = UserLoginPhase.pending;
      })
      .addCase(login.fulfilled, (state, { payload }: PayloadAction<TAuthUserResponse>) => {
        state.userLoginPhase = UserLoginPhase.fulfilled;
        setUser(state, payload.user);
      })
      .addCase(login.rejected, (state) => {
        state.userLoginPhase = UserLoginPhase.rejected;
      });

    builder
      .addCase(logout.pending, () => {})
      .addCase(logout.fulfilled, (state) => {
        resetUser(state);
        state.userLoginPhase = UserLoginPhase.initial;
      })
      .addCase(logout.rejected, () => {});

    builder
      .addCase(updateUserData.pending, (state) => {
        state.updateUserDataPhase = UpdateUserDataPhase.pending;
      })
      .addCase(updateUserData.fulfilled, (state, { payload }: PayloadAction<IUserResponse>) => {
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
      .addCase(doAutoLogin.fulfilled, (state, { payload }: PayloadAction<User>) => {
        state.autoLoginPhase = AutoLoginPhase.fulfilled;
        state.userLoginPhase = UserLoginPhase.fulfilled;
        setUser(state, payload);
      })
      .addCase(doAutoLogin.rejected, (state) => {
        state.autoLoginPhase = AutoLoginPhase.rejected;
      });
  },
});

const { reducer } = userSlice;

export { reducer as userReducer };

export const {
  interruptUserLogin,
  interruptUpdateUserData,
  interruptUserRegistration,
  interruptPasswordResettingWorkflow,
} = userSlice.actions;
