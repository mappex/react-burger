/* eslint-disable no-extra-parens */
import { IngredientType } from '../../utils/types';
import * as apiModule from '../api';
import {
  orderDetailsReducer,
  createOrder,
} from './order-details';

jest.mock('../api', () => ({
  fetchCreateOrder: jest.fn(),
}));

const aBun = Object.freeze({
  _id: '60d3b41abdacab0026a733c6',
  name: 'Краторная булка N-200i',
  type: IngredientType.BUN,
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
});

const aSauce = Object.freeze({
  _id: '60d3b41abdacab0026a733cc',
  name: 'Соус Spicy-X',
  type: IngredientType.SAUCE,
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  __v: 0,
});

describe('orderDetails reducer', () => {
  const initialState = Object.freeze({
    orderDetails: null,
    orderDetailsError: null,
    orderDetailsRequest: false,
  });

  afterAll(() => {
    jest.unmock('../api');
  });

  it('has initial state', () => {
    expect(orderDetailsReducer(undefined, { type: 'some action' })).toEqual(
      initialState,
    );
  });

  describe('createOrder', () => {
    it('doesn\'t call createOrder if ingredient list is empty', async () => {
      const action = createOrder([]);
      const dispatch = jest.fn();
      const getState = jest.fn();

      await action(dispatch, getState, undefined);

      expect(dispatch.mock.calls.map(([{ type }]) => type)).toEqual([
        'order/createOrder/pending',
        'order/createOrder/rejected',
      ]);
      expect(apiModule.fetchCreateOrder).toHaveBeenCalledTimes(0);
    });

    it('doesn\'t call createOrder if not authenticated', async () => {
      const action = createOrder([aBun._id, aSauce._id, aBun._id]);
      const dispatch = jest.fn();
      const getState = jest.fn();

      await action(dispatch, getState, undefined);

      expect(dispatch.mock.calls.map(([{ type }]) => type)).toEqual([
        'order/createOrder/pending',
        'order/createOrder/rejected',
      ]);
      expect(apiModule.fetchCreateOrder).toHaveBeenCalledTimes(0);
    });

    it('correctly call createOrder', async () => {
      const ingredientIds = [aBun._id, aSauce._id, aSauce._id, aBun._id];
      const action = createOrder(ingredientIds);
      const dispatch = jest.fn();
      const getState = jest.fn();

      document.cookie = 'accessSchema=accessSchema';
      document.cookie = 'accessToken=accessToken';

      await action(dispatch, getState, undefined);

      expect(dispatch.mock.calls.map(([{ type }]) => type)).toEqual([
        'order/createOrder/pending',
        'order/createOrder/fulfilled',
      ]);
      expect(apiModule.fetchCreateOrder).toHaveBeenCalledTimes(1);
      expect((apiModule.fetchCreateOrder as jest.Mock).mock.calls[0][0]).toEqual({
        auth: { accessSchema: 'accessSchema', accessToken: 'accessToken' },
        ingredients: ingredientIds,
      });
    });

    it('updates state with createOrder result (pending)', () => {
      const state = orderDetailsReducer(initialState, {
        type: 'order/createOrder/pending',
      });

      expect(state.orderDetailsRequest).toEqual(true);
    });

    it('updates state with createOrder result (rejected)', () => {
      const error = Symbol('error');
      const state = orderDetailsReducer(initialState, {
        type: 'order/createOrder/rejected',
        error,
      });

      expect(state.orderDetailsRequest).toEqual(false);
      expect(state.orderDetailsError).toEqual(error);
    });

    it('updates state with createOrder result', () => {
      const orderDetails = Symbol('order details');

      const state = orderDetailsReducer(initialState, {
        type: 'order/createOrder/fulfilled',
        payload: orderDetails,
      });

      expect(state.orderDetails).toEqual(orderDetails);
    });
  });
});
