/* eslint-disable node/no-missing-import */
import Cookies from 'universal-cookie';

import r from '../../utils/routes';

const cookiesCtrl = new Cookies();
const authRefreshTokenKey = 'authRefreshToken';

export const authenticationSideEffect = ({ accessSchema, accessToken, refreshToken }) => {
  const cookies = {
    accessSchema,
    accessToken,
  };

  Object.entries(cookies).forEach(([cookieName, cookieValue]) =>
    cookiesCtrl.set(cookieName, cookieValue, { path: r.home }),
  );

  localStorage.setItem(authRefreshTokenKey, refreshToken);
};

export const cleanUpAuthenticationSideEffect = () => {
  localStorage.removeItem(authRefreshTokenKey);

  ['accessSchema', 'accessToken'].forEach(cookieName =>
    cookiesCtrl.remove(cookieName),
  );
};

export const getAccessSchemaAndToken = () => {
  return ['accessSchema', 'accessToken'].reduce((result, cookieName) => Object.assign(result, {
    [cookieName]: cookiesCtrl.get(cookieName),
  }), {});
};

export const getRefreshToken = () => {
  return localStorage.authRefreshToken;
};

export const getAuthHeaderValue = () => {
  const { accessSchema, accessToken } = getAccessSchemaAndToken();

  if (accessSchema && accessToken) {
    return `${accessSchema} ${accessToken}`;
  }
};

export const setUser = (state, user) => {
  state.user = user;
  state.userTimeStamp = new Date().getTime();
};

export const resetUser = (state) => {
  delete state.user;
  delete state.userTimeStamp;
};
