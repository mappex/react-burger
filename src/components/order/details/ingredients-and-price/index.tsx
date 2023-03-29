import { FC } from 'react';
import cs from 'classnames';

import { Amount } from '../../../amount';
import { IngredientIcon } from '../../../ingredient/icon';
import { TIngredient } from '../../../../utils/types';

import styles from './index.module.css';

const ingredientAndPriceCls = 'ingredient-and-price';

const IngredientAndPrice: FC<{
  ingredient: TIngredient;
  quantity: number;
}> = ({ ingredient, quantity }) => (
  <li
    className = { cs(
      styles[ingredientAndPriceCls],
      'mr-6',
    ) }>
    <IngredientIcon ingredient = { ingredient } />
    <div className = { 'pl-4' } />
    <div>{ ingredient.name }</div>
    <div className = { 'pl-4' } />
    <div
      className = {
        styles[
          `${ingredientAndPriceCls}__quantity-and-price-wrapper`
        ]
      }>
      <div
        className = {
          styles[`${ingredientAndPriceCls}__quantity`]
        }>
        { quantity } x{ ' ' }
      </div>
      <Amount amount = { ingredient.price * quantity } />
    </div>
  </li>
);

export { IngredientAndPrice };
