/* eslint-disable node/no-missing-import */
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import {
  AutoLoginPhase,
  doAutoLogin,
} from '../../services/reducers/user';
import {
  fetchIngredients,
} from '../../services/reducers/ingredients';
import {
  useAppDispatch,
  useAppSelector,
} from '../../services/store';
import {
  getUser,
  getIngredients,
} from '../../services/selectors';

import AppBody from '../app-body';
import AppHeader from '../app-header';

import style from './index.module.css';

const App = () => {
  const { ingredientsError, ingredientsRequest } = useAppSelector(getIngredients);
  const { autoLoginPhase } = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(doAutoLogin());
  }, [dispatch]);

  if (![AutoLoginPhase.fulfilled, AutoLoginPhase.rejected].includes(autoLoginPhase)) {
    return null;
  }

  return (
    <div className = { style.app }>
      <BrowserRouter>
        <AppHeader />
        { !ingredientsRequest && !ingredientsError && <AppBody /> }
      </BrowserRouter>
    </div>
  );
};

export default App;
