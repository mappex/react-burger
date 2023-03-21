import {
  API_HOST,
} from './consts';

import l from '../../utils/lang';
import {
  AuthUserResponse,
  Ingredient_t,
  OrderDetails_t,
  OrderStatus_t,
  RefreshTokensResponse,
  UserResponse,
  User,
} from '../../utils/types';

const getAccessSchemaAndTokenAndRefreshToken = (response: any): RefreshTokensResponse => {
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

const checkReponse = (response: any) => {
  return response.ok ? response.json() : response.json().then((error: any) => {
    return error;
  });
};

/* INGREDIENTS ********************************************************************************************************/
// GET
export const fetchIngredients = async (): Promise<Ingredient_t[]> => {
  const response = await fetch(`${API_HOST}/api/ingredients`).then(checkReponse);

  if (response.success !== true) {
    throw new Error('Can\'t get data from server');
  }

  return response.data;
};

/* ORDERS *************************************************************************************************************/
// POST
export const fetchCreateOrder = async (
  ingredients: Ingredient_t['_id'][],
): Promise<OrderDetails_t> => {
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
    status: OrderStatus_t.BEING_COOKED,
  };
};

/* AUTH ***************************************************************************************************************/
// Login
interface IAuthLoginRequestParams {
  email: string;
  password: string;
}
export const fetchAuthLogin = async ({
  email,
  password,
}: IAuthLoginRequestParams): Promise<AuthUserResponse> => {
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
export const fetchAuthLogout = async ({
  refreshToken: token,
}: Pick<RefreshTokensResponse, 'refreshToken'>): Promise<void> => {
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
export const fetchAuthTokens = async ({
  refreshToken: token,
}: Pick<RefreshTokensResponse, 'refreshToken' >): Promise<RefreshTokensResponse> => {
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
interface IAuthRegisterRequestParams {
  email: string;
  name: string;
  password: string;
}
export const fetchAuthRegister = async ({
  email,
  name,
  password,
}: IAuthRegisterRequestParams): Promise<AuthUserResponse> => {
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
type TAccessSchemaWithToken = Pick<RefreshTokensResponse, 'accessSchema' | 'accessToken'>;
type TAuthUserDataParams = {
  auth: TAccessSchemaWithToken;
};
export const fetchAuthUserData = async ({
  auth: { accessSchema, accessToken },
}: TAuthUserDataParams): Promise<User> => {
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
type TAuthUserDataUpdateParams = {
  auth: TAccessSchemaWithToken;
  data: {
    email: string;
    name: string;
    password: string;
  };
};
export const fetchAuthUserDataUpdate = async ({
  auth: { accessSchema, accessToken },
  data: { email, name, password },
}: TAuthUserDataUpdateParams): Promise<UserResponse> => {
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
interface IPasswordResetForEmailRequestParams {
  email: string;
}
export const fetchPasswordResetForEmail = async ({
  email,
}: IPasswordResetForEmailRequestParams): Promise<void> => {
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
interface IPasswordNewRequestParams {
  password: string;
  token: string;
}
export const fetchPasswordNew = async ({
  password,
  token,
}: IPasswordNewRequestParams): Promise<void> => {
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
