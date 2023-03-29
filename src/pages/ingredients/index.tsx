import { FC } from 'react';
import {
  Navigate,
  useParams,
} from 'react-router-dom';

import { IngredientDetails } from '../../components/ingredient/details';
import { useAppSelector } from '../../services/store';
import {
  getIngredients,
} from '../../services/selectors';

import styles from './index.module.css';
import r from '../../utils/routes';

const IngredientsPage: FC = () => {
  const { id } = useParams() as { id: string };
  const { idToIngredientMap, ingredientsRequest } = useAppSelector(getIngredients);

  if (ingredientsRequest) {
    return null;
  }

  const { [id]: ingredient } = idToIngredientMap;

  if (!ingredient) {
    return <Navigate to = { r.home } />;
  }

  return (
    <div className = { `${styles.container}` }>
      <IngredientDetails />
    </div>
  );
};

export { IngredientsPage };
