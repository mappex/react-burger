import React, { FC } from 'react';
import {
  useNavigate,
} from 'react-router-dom';

import styles from './index.module.css';

import { TIngredient } from '../../../../utils/types';
import BurgerIngredient from '../ingredient';

const BurgerIngredientType: FC<{
  className?: string;
  ingredients: TIngredient[];
  title: string;
  type: string;
}> = ({ className, ingredients, title, type }) => {
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

export default BurgerIngredientType;
