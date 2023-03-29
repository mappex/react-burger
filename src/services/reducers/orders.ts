import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type {
  PayloadAction,
  AsyncThunk,
} from '@reduxjs/toolkit';

import { Order } from '../../utils/types';
import {
  generateActionTypes,
  getAccessSchemaAndToken,
} from '../helpers';
import { WsActionTypes } from '../middleware';

const initialState: Readonly<{
  orders: Order[];
  total?: number;
  totalToday?: number;
  userOrders: Order[];
}> = {
  orders: [],
  userOrders: [],
};

const chunkCodeToUrlMap: {
  orders: string;
  userOrders: string;
} = {
  orders: '/orders/all',
  userOrders: '/orders',
};

type ChunkCodeToChunkWsDataMap = {
  [key in keyof typeof chunkCodeToUrlMap]: {
    subscribe: AsyncThunk<void, void, {}>;
    unsubscribe: AsyncThunk<void, void, {}>;
    url: string;
    wsActionTypes: WsActionTypes;
  };
};

enum OperationType {
  ORDERS = 'orders',
  USERORDERS = 'userOrders',
}

const chunkCodeToChunkWsDataMap: ChunkCodeToChunkWsDataMap = Object.entries(chunkCodeToUrlMap)
  .reduce((result, [key, url]) => {
    const wsActionTypes = generateActionTypes();

    result[key as keyof typeof chunkCodeToUrlMap] = {
      subscribe: createAsyncThunk(`orders/${key}/subscribe`, (self, { dispatch }) => {
        if (key === OperationType.ORDERS) {
          dispatch({ type: wsActionTypes.wsOpenConnection });
        }

        if (key === OperationType.USERORDERS) {
          const { accessSchema, accessToken } = getAccessSchemaAndToken();

          if (!accessSchema || !accessToken) {
            throw new Error('Action cannot be handled');
          }

          dispatch({
            type: wsActionTypes.wsOpenConnection,
            payload: { auth: { accessSchema, accessToken } },
          });
        }
      }),
      unsubscribe: createAsyncThunk(`orders/${key}/unsubscribe`, (self, { dispatch }) => {
        dispatch({
          type: wsActionTypes.wsCloseConnection,
        });
      }),
      url,
      wsActionTypes,
    };

    return result;
  }, {} as ChunkCodeToChunkWsDataMap);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    [chunkCodeToChunkWsDataMap.orders.wsActionTypes.wsGetMessage](state, {
      payload: { success, orders, total, totalToday },
    }: PayloadAction<{ success: boolean; orders?: Order[]; total?: number; totalToday?: number; }>) {
      if (success) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.orders = orders!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.total = total!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.totalToday = totalToday!;
      }
    },
    [chunkCodeToChunkWsDataMap.userOrders.wsActionTypes.wsGetMessage](state, {
      payload: { success, orders },
    }: PayloadAction<{ success: boolean; orders?: Order[]; total?: number; totalToday?: number; }>) {
      if (success) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.userOrders = orders!;
      }
    },
  },
  extraReducers(builder) {
    // eslint-disable-next-line no-empty-function
    builder.addCase(chunkCodeToChunkWsDataMap.orders.subscribe.pending, () => {});
    // eslint-disable-next-line no-empty-function
    builder.addCase(chunkCodeToChunkWsDataMap.userOrders.subscribe.pending, () => {});
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toObject = (pairs: any): WsActionTypes => {
  // @ts-ignore
  return Array.from(pairs).reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {});
};

export const urlAndWaActionTypesPairs = Object
  .values(chunkCodeToChunkWsDataMap)
  .map(chunkWsData => ({
    ...chunkWsData,
    wsActionTypes: toObject(
      Object.entries(chunkWsData.wsActionTypes).map(([waActionType, actionType]) => [
        waActionType,
        ordersSlice.actions[actionType] ? ordersSlice.actions[actionType].type : actionType,
      ]),
    ) as WsActionTypes,
  }))
  .map(({ url, wsActionTypes }): [string, WsActionTypes] => [
    url,
    wsActionTypes,
  ]);

const { reducer } = ordersSlice;

export { reducer as ordersReducer };

export const subscribeForOrders = chunkCodeToChunkWsDataMap.orders.subscribe;
export const subscribeForUserOrders = chunkCodeToChunkWsDataMap.userOrders.subscribe;
export const unsubscribeForUserOrders = chunkCodeToChunkWsDataMap.userOrders.unsubscribe;
