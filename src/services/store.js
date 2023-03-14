/* eslint-disable node/no-missing-import */
import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import reducers from './reducers';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = action => useSelector(action);

export default configureStore({
  devTools: process.env.NODE_ENV === 'development',
  reducer: reducers,
});
