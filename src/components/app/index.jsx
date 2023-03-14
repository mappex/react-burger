/* eslint-disable node/no-missing-import */
import { useEffect } from 'react';

import styles from './index.module.css';

import {
  useAppDispatch,
  useAppSelector,
} from '../../services/store';

import { getIngredients } from '../../services/selectors';
import { fetchIngredients } from '../../services/reducers/ingredients';

import AppHeader from '../app-header';
import AppBody from '../app-body';

const App = () => {
  const { ingredientsError, ingredientsRequest } = useAppSelector(getIngredients);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className = { styles.main }>
      <AppHeader />
      { !ingredientsRequest && !ingredientsError && <AppBody /> }
    </div>
  );
};

export default App;
