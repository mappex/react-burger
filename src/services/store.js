/* eslint-disable node/no-missing-import */
import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import mainReducer from './reducers';

const store = configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer: {
    main: mainReducer,
  },
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = action => useSelector(action);

export default store;
