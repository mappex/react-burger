import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  shallowEqual,
} from 'react-redux';

import { socketMiddlewareFabric } from './middleware';
import { API_HOST } from './api/consts';
import reducers  from './reducers';
import {
  urlAndWaActionTypesPairs,
} from './reducers/orders';


const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(
      urlAndWaActionTypesPairs.map(([url, wsActionTypes]) => {
        const result = socketMiddlewareFabric(`ws${`${API_HOST.replace(/^http/, '')}`}${url}`, wsActionTypes);

        return result;
      }),
    );
  },
  reducer: reducers,
});

export type TRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(
  func: (state: TRootState) => T,
  cmp?: typeof shallowEqual,
): T => useSelector(func, cmp);

export { store };
