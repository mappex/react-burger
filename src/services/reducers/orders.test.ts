/* eslint-disable no-extra-parens */
import {
  initialState,
  ordersReducer,
  subscribeForOrders,
  subscribeForUserOrders,
  unsubscribeForUserOrders,
} from './orders';

describe('orders reducer', () => {
  it('has initial state', () => {
    expect(ordersReducer(undefined, { type: 'some action' })).toEqual(
      initialState,
    );
  });

  describe('actions', () => {
    it('dispatches open action for the middleware (subscribeForOrders)', async () => {
      const action = subscribeForOrders();
      const dispatch = jest.fn();
      const getState = jest.fn();

      await action(dispatch, getState, undefined);

      expect(
        (dispatch as jest.Mock).mock.calls
          .map(([{ type }]) => type)
          .filter(type => type.startsWith('wsOpenConnection')).length,
      ).toEqual(1);
    });

    it('doesn\'t dispatch open action for the middleware (subscribeForUserOrders) if not authenticated', async () => {
      const action = subscribeForUserOrders();
      const dispatch = jest.fn();
      const getState = jest.fn();

      await action(dispatch, getState, undefined);

      expect(
        (dispatch as jest.Mock).mock.calls
          .map(([{ type }]) => type)
          .filter(type => type.startsWith('wsOpenConnection')).length,
      ).toEqual(0);
    });

    it('dispatches open action for the middleware (subscribeForUserOrders)', async () => {
      const action = subscribeForUserOrders();
      const dispatch = jest.fn();
      const getState = jest.fn();

      const currentAuthSchema = 'accessSchema';
      const currentAccessToken = 'accessToken';

      document.cookie = `accessSchema=${currentAuthSchema}`;
      document.cookie = `accessToken=${currentAccessToken}`;

      await action(dispatch, getState, undefined);

      expect(
        (dispatch as jest.Mock).mock.calls
          .map(([{ type }]) => type)
          .filter(type => type.startsWith('wsOpenConnection')).length,
      ).toEqual(1);
    });

    it('dispatches close action for the middleware (subscribeForUserOrders)', async () => {
      const action = unsubscribeForUserOrders();
      const dispatch = jest.fn();
      const getState = jest.fn();

      await action(dispatch, getState, undefined);

      expect(
        (dispatch as jest.Mock).mock.calls
          .map(([{ type }]) => type)
          .filter(type => type.startsWith('wsCloseConnection')).length,
      ).toEqual(1);
    });
  });
});
