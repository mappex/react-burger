/* eslint-disable no-param-reassign */
import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import {
  fetchCreateOrder as apiCreateOrder,
} from '../api';

const initialState = {
  orderDetails: null,
  orderDetailsError: null,
  orderDetailsRequest: false,
};

export const createOrder = createAsyncThunk('order/createOrder', (ingredients) => {
  if (ingredients.length === 0) {
    throw new Error(
      'Unable to place an order for the empty ingredients list',
    );
  }

  return apiCreateOrder(ingredients);
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
      .addCase(createOrder.fulfilled, (state, { payload: orderDetails }) => {
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

export const {
  resetOrderDetails,
} = orderDetailsSlice.actions;

export default orderDetailsSlice.reducer;
