/* eslint-disable node/no-missing-import */
import {
  Navigate,
  useParams,
} from 'react-router-dom';

import { IngredientDetails } from '../../components/ingredient-details';
import { useAppSelector } from '../../services/store';
import {
  getIngredients,
} from '../../services/selectors';

import styles from './index.module.css';

const IngredientsPage = () => {
  const { id } = useParams();
  const { idToIngredientMap, ingredientsRequest } = useAppSelector(getIngredients);

  if (ingredientsRequest) {
    return null;
  }

  const { [id]: ingredient } = idToIngredientMap;

  if (!ingredient) {
    return <Navigate to = { '/' } />;
  }

  return (
    <div className = { `${styles.container}` }>
      <IngredientDetails />
    </div>
  );
};

export { IngredientsPage };
