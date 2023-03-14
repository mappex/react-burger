/* eslint-disable node/no-missing-import */
import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';

import BurgerIngredient from '../ingredient';

import { useAppDispatch } from '../../../../services/store';
import { setDetailedIngredient } from '../../../../services/reducers';

const BurgerIngredientType = ({
  className, ingredients, title, type,
}) => {
  const dispatch = useAppDispatch();

  return (
    <li className = { `pt-10 ${className}` } data-type = { type }>
      <div className = { 'text text_type_main-medium' }>{ title }</div>
      <ul
        className = { `${styles['burger-ingredient-type__ingredient-list']} pt-6 pr-4 pl-4` }>
        {
          ingredients.map((ingredient, ix) => (
            <React.Fragment key = { ingredient._id }>
              <BurgerIngredient
                ingredient = { ingredient }
                onClick = { () => {
                  dispatch(setDetailedIngredient(ingredients[ix]));
                } } />
              <li className = { (ix % 2 === 0 && ' pl-6 ') + (ix % 2 === 1 && ' pt-8 ') } />
            </React.Fragment>
          ))
        }
      </ul>
    </li>
  );
};

BurgerIngredientType.propTypes = {
  className: PropTypes.string,
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default BurgerIngredientType;
