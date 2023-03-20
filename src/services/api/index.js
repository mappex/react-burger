import {
  API_HOST,
} from './consts';

import l from '../../utils/lang';
import {
  OrderStatus,
} from '../../utils/types';

const getAccessSchemaAndTokenAndRefreshToken = (response) => {
  const {
    accessToken: accessTokenWithSchema,
    refreshToken,
  } = response;
  const [accessSchema, accessToken] = accessTokenWithSchema.split(' ');

  return {
    accessSchema,
    accessToken,
    refreshToken,
  };
};

const checkReponse = (response) => {
  return response.ok ? response.json() : response.json().then((error) => {
    return error;
  });
};

/* INGREDIENTS ********************************************************************************************************/
// GET
export const fetchIngredients = async () => {
  const response = await fetch(`${API_HOST}/api/ingredients`).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }

  return response.data;
};

/* ORDERS *************************************************************************************************************/
// POST
export const fetchCreateOrder = async (ingredients = []) => {
  const response = await fetch(`${API_HOST}/api/orders`, {
    body: JSON.stringify({ ingredients }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }

  return {
    id: response.order.number,
    message: l('order_details_wait_readiness'),
    status: OrderStatus.BEING_COOKED,
  };
};

/* AUTH ***************************************************************************************************************/
// Login
export const fetchAuthLogin = async ({ email, password }) => {
  const response = await fetch(`${API_HOST}/api/auth/login`, {
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }

  const {
    user: {
      email: authEmail,
      name: authName,
    },
  } = response;

  return {
    ...getAccessSchemaAndTokenAndRefreshToken(response),
    user: {
      email: authEmail,
      name: authName,
    },
  };
};

// Logout
export const fetchAuthLogout = async ({ refreshToken: token }) => {
  const response = await fetch(`${API_HOST}/api/auth/logout`, {
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }
};

// Token
export const fetchAuthTokens = async ({ refreshToken: token }) => {
  const response = await fetch(`${API_HOST}/api/auth/token`, {
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }

  return getAccessSchemaAndTokenAndRefreshToken(response);
};

// Register
export const fetchAuthRegister = async ({ email, name, password }) => {
  const response = await fetch(`${API_HOST}/api/auth/register`, {
    body: JSON.stringify({ email, name, password }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }

  const {
    refreshToken,
    accessToken: accessTokenWithSchema,
    user: {
      email: authEmail,
      name: authName,
    },
  } = response;

  const [accessSchema, accessToken] = accessTokenWithSchema.split(' ');

  return {
    accessSchema,
    accessToken,
    refreshToken,
    user: {
      email: authEmail,
      name: authName,
    },
  };
};

// Get User info
export const fetchAuthUserData = async ({ auth: { accessSchema, accessToken } }) => {
  const response = await fetch(`${API_HOST}/api/auth/user`, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `${accessSchema} ${accessToken}`,
    },
    method: 'GET',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error(response.message || 'Can\'t get data from server');
  }

  return response.user;
};

// Set User info
export const fetchAuthUserDataUpdate = async ({
  auth: { accessSchema, accessToken },
  data: { email, name, password },
}) => {
  const response = await fetch(`${API_HOST}/api/auth/user`, {
    body: JSON.stringify({ name, email, password }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `${accessSchema} ${accessToken}`,
    },
    method: 'PATCH',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error(response.message || 'Can\'t get data from server');
  }

  return {
    user: response.user,
  };
};

/* PASSWORD ***********************************************************************************************************/
// Reset for Email
export const fetchPasswordResetForEmail = async ({ email }) => {
  const response = await fetch(`${API_HOST}/api/password-reset`, {
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }
};
// Reset password
export const fetchPasswordNew = async ({ password, token }) => {
  const response = await fetch(`${API_HOST}/api/password-reset/reset`, {
    body: JSON.stringify({ password, token }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  }).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }
};
