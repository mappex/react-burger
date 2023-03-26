import Cookies from 'universal-cookie';
import { v4 as uuidV4 } from 'uuid';

import {
  WsActionType,
  WsActionTypes,
} from '../middleware';
import {
  TAuthUserResponse,
  IRefreshTokensResponse,
} from '../../utils/types';

const authRefreshTokenKey = 'authRefreshToken';
const cookiesCtrl = new Cookies();

export const authenticationSideEffect = ({
  accessSchema,
  accessToken,
  refreshToken,
}: IRefreshTokensResponse) => {
  const cookies = {
    accessSchema,
    accessToken,
  };

  Object.entries(cookies).forEach(([cookieName, cookieValue]) =>
    cookiesCtrl.set(cookieName, cookieValue, { path: '/' }),
  );
  localStorage.setItem(authRefreshTokenKey, refreshToken);
};

export const cleanUpAuthenticationSideEffect = () => {
  localStorage.removeItem(authRefreshTokenKey);
  ['accessSchema', 'accessToken'].forEach(cookieName =>
    cookiesCtrl.remove(cookieName, { path: '/' }),
  );
};

export const generateActionTypes = (): WsActionTypes => {
  const id = uuidV4();

  return {
    wsCloseConnection: `${WsActionType.wsCloseConnection}_${id}`,
    wsConnectionSuccess: `${WsActionType.wsConnectionSuccess}_${id}`,
    wsConnectionError: `${WsActionType.wsConnectionError}_${id}`,
    wsConnectionClose: `${WsActionType.wsConnectionClose}_${id}`,
    wsGetMessage: `${WsActionType.wsGetMessage}_${id}`,
    wsOpenConnection: `${WsActionType.wsOpenConnection}_${id}`,
    wsSendMessage: `${WsActionType.wsSendMessage}_${id}`,
  };
};

export const getAccessSchemaAndToken = (): Partial<Pick<IRefreshTokensResponse, 'accessSchema' | 'accessToken'>> => {
  return ['accessSchema', 'accessToken'].reduce(
    (result, cookieName) =>
      Object.assign(result, {
        [cookieName]: cookiesCtrl.get(cookieName),
      }),
    {},
  );
};

export const getRefreshToken = ():
| TAuthUserResponse['refreshToken']
| undefined => {
  return localStorage.authRefreshToken;
};

export const getAuthHeaderValue = (): string | undefined => {
  const { accessSchema, accessToken } = getAccessSchemaAndToken();

  if (accessSchema && accessToken) {
    return `${accessSchema} ${accessToken}`;
  }
};

export const setUser = (state: any, user: any) => {
  state.user = user;
  state.userTimeStamp = new Date().getTime();
};

export const resetUser = (state: any) => {
  delete state.user;
  delete state.userTimeStamp;
};
