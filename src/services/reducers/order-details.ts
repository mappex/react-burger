import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  TIngredient,
  TOrderDetails,
} from '../../utils/types';
import { getAccessSchemaAndToken } from '../helpers';

import {
  fetchCreateOrder as apiCreateOrder,
} from '../api';

export const initialState: Readonly<{
  orderDetails: TOrderDetails | null;
  orderDetailsError: unknown | null;
  orderDetailsRequest: boolean;
}> = {
  orderDetails: null,
  orderDetailsError: null,
  orderDetailsRequest: false,
};

export type TInitialState = typeof initialState;

export const createOrder = createAsyncThunk('order/createOrder', (ingredients: TIngredient['_id'][]) => {
  if (ingredients.length === 0) {
    throw new Error(
      'Unable to place an order for the empty ingredients list',
    );
  }

  const { accessSchema, accessToken } = getAccessSchemaAndToken();

  if (!accessSchema || !accessToken) {
    throw new Error('Action cannot be handled');
  }

  return apiCreateOrder({
    ingredients,
    auth: { accessSchema, accessToken },
  });
});

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {
    resetOrderDetails(state) {
      if (!state.orderDetailsRequest) {
        Object.assign(state, {
          orderDetails: null,
          orderDetailsError: null,
          orderDetailsRequest: false,
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        Object.assign(state, {
          orderDetails: null,
          orderDetailsError: null,
          orderDetailsRequest: true,
        });
      })
      .addCase(createOrder.fulfilled, (state, { payload: orderDetails }: PayloadAction<TOrderDetails>) => {
        Object.assign(state, {
          orderDetails,
          orderDetailsRequest: false,
        });
      })
      .addCase(createOrder.rejected, (state, { error }) => {
        Object.assign(state, {
          orderDetailsError: error,
          orderDetailsRequest: false,
        });
      });
  },
});

const { reducer } = orderDetailsSlice;

export { reducer as orderDetailsReducer };

export const {
  resetOrderDetails,
} = orderDetailsSlice.actions;
