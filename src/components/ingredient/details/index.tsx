import React, {
  FC,
  useMemo,
} from 'react';
import {
  useParams,
} from 'react-router-dom';

import styles from './index.module.css';
import l from '../../../utils/lang';

import { useAppSelector } from '../../../services/store';
import {
  getIngredients,
} from '../../../services/selectors';

const IngredientDetails: FC<{ className?: string }> = ({ className }) => {
  const { id } = useParams() as { id: string };

  const { idToIngredientMap } = useAppSelector(getIngredients);
  const {
    calories,
    carbohydrates,
    fat,
    proteins,
    image,
    name: title,
  } = idToIngredientMap[id];
  const nutritionalValues = useMemo(() => {
    return {
      calories,
      carbohydrates,
      fat,
      proteins,
    };
  }, [calories, carbohydrates, fat, proteins]);

  return (
    <div className = { `${styles['ingredient-details']} mb-5 ${className}` }>
      <div
        className = { `${styles['ingredient-details__picture-wrapper']} pl-5 pr-5` }>
        <img
          alt = { title }
          className = { styles['ingredient-details__picture'] }
          src = { image } />
      </div>
      <div className = { 'pt-4' } />
      <div
        className = { `${styles['ingredient-details__title']} text text_type_main-medium` }>
        { title }
      </div>
      <div className = { 'pt-8' } />
      <div className = { styles['ingredient-details__nutritional-values'] }>
        { Object.entries(nutritionalValues).map(([key, value], ix, list) => (
          <React.Fragment key = { key }>
            <div className = { styles['ingredient-details__nutritional-value'] }>
              <div
                className = { styles['ingredient-details__nutritional-value-title'] }>
                { /* @ts-ignore */ }
                { l(key) }
              </div>
              <div
                className = { `${styles['ingredient-details__nutritional-value-value']} text text_type_digits-default pt-2` }>
                { value }
              </div>
            </div>
            { ix + 1 < list.length ? <div className = { 'pl-5' } /> : null }
          </React.Fragment>
        )) }
      </div>
    </div>
  );
};

export { IngredientDetails };
