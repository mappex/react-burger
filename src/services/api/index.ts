import {
  API_HOST,
} from './consts';

import l from '../../utils/lang';
import {
  TAuthUserResponse,
  TIngredient,
  TOrderDetails,
  TOrderStatus,
  IRefreshTokensResponse,
  IUserResponse,
  User,
} from '../../utils/types';

interface ITokenRefreshResponse {
  accessSchema: string;
  accessToken: string;
  refreshToken: string;
}

const getAccessSchemaAndTokenAndRefreshToken = (response: ITokenRefreshResponse): IRefreshTokensResponse => {
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

const checkReponse = (response: Response) => {
  return response.ok ? response.json() : response.json().then((error: any) => {
    return error;
  });
};

interface ICheckSuccessResponse {
  success: boolean;
  data: any;
}

const checkSuccess = (response: ICheckSuccessResponse) => {
  if (response && response.success) {
    return response.data;
  }

  throw new Error('Can\'t get data from server');
};

/* INGREDIENTS ********************************************************************************************************/
// GET
export const fetchIngredients = async (): Promise<TIngredient[]> => {
  const response = await fetch(`${API_HOST}/api/ingredients`)
    .then(checkReponse)
    .then(checkSuccess);

  return response;
};

/* ORDERS *************************************************************************************************************/
// POST
type TCreateOrderParams = {
  ingredients: TIngredient['_id'][];
  auth: TAccessSchemaWithToken;
};
export const fetchCreateOrder = async ({
  ingredients,
  auth: { accessSchema, accessToken },
}: TCreateOrderParams): Promise<TOrderDetails> => {
  const response = await fetch(`${API_HOST}/api/orders`, {
    body: JSON.stringify({ ingredients }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `${accessSchema} ${accessToken}`,

    },
    method: 'POST',
  })
    .then(checkReponse)
    .then(checkSuccess);

  return {
    id: response.order.number,
    message: l('order_details_wait_readiness'),
    status: TOrderStatus.PENDING,
  };
};

/* AUTH ***************************************************************************************************************/
// Login
export interface IAuthLoginRequestParams {
  email: string;
  password: string;
}
export const fetchAuthLogin = async ({
  email,
  password,
}: IAuthLoginRequestParams): Promise<TAuthUserResponse> => {
  const response = await fetch(`${API_HOST}/api/auth/login`, {
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  })
    .then(checkReponse)
    .then(checkSuccess);

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
}: Pick<IRefreshTokensResponse, 'refreshToken'>): Promise<void> => {
  await fetch(`${API_HOST}/api/auth/logout`, {
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  })
    .then(checkReponse)
    .then(checkSuccess);
};

// Token
export const fetchAuthTokens = async ({
  refreshToken: token,
}: Pick<IRefreshTokensResponse, 'refreshToken' >): Promise<IRefreshTokensResponse> => {
  const response = await fetch(`${API_HOST}/api/auth/token`, {
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  })
    .then(checkReponse)
    .then(checkSuccess);

  return getAccessSchemaAndTokenAndRefreshToken(response);
};

// Register
export interface IAuthRegisterRequestParams {
  email: string;
  name: string;
  password: string;
}
export const fetchAuthRegister = async ({
  email,
  name,
  password,
}: IAuthRegisterRequestParams): Promise<TAuthUserResponse> => {
  const response = await fetch(`${API_HOST}/api/auth/register`, {
    body: JSON.stringify({ email, name, password }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  })
    .then(checkReponse)
    .then(checkSuccess);

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
export type TAccessSchemaWithToken = Pick<IRefreshTokensResponse, 'accessSchema' | 'accessToken'>;
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
  })
    .then(checkReponse)
    .then(checkSuccess);

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
}: TAuthUserDataUpdateParams): Promise<IUserResponse> => {
  const response = await fetch(`${API_HOST}/api/auth/user`, {
    body: JSON.stringify({ name, email, password }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      Authorization: `${accessSchema} ${accessToken}`,
    },
    method: 'PATCH',
  })
    .then(checkReponse)
    .then(checkSuccess);

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
  await fetch(`${API_HOST}/api/password-reset`, {
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  })
    .then(checkReponse)
    .then(checkSuccess);
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
  await fetch(`${API_HOST}/api/password-reset/reset`, {
    body: JSON.stringify({ password, token }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  })
    .then(checkReponse)
    .then(checkSuccess);
};
