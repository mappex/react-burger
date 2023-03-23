import React from 'react';
import PropTypes from 'prop-types';
import {
  useNavigate,
} from 'react-router-dom';

import styles from './index.module.css';

import { Ingredient_t } from '../../../../utils/types';
import BurgerIngredient from '../ingredient';

const BurgerIngredientType = ({
  className,
  ingredients,
  title,
  type,
}: {
  className?: string;
  ingredients: Ingredient_t[];
  title: string;
  type: string;
}) => {
  const navigate = useNavigate();

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
                  navigate(`/ingredients/${ingredient._id}`, {
                    state: {
                      background: true,
                    },
                  });
                } } />
              <li className = { (ix % 2 === 0 ? ' pl-6 ' : '') + (ix % 2 === 1 ? ' pt-8 ' : '') } />
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
