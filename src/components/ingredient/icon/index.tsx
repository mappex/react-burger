import cs from 'classnames';

import { TIngredient } from '../../../utils/types';

import styles from './index.module.css';

export enum IngredientIconRenderType {
  div = 'div',
  li = 'li',
}

const ingredientIconCls = 'ingredient-icon';

const IngredientIcon = ({
  className,
  ingredient,
  moreIngredientsCount,
  tag,
}: {
  className?: string;
  ingredient: TIngredient;
  moreIngredientsCount?: number;
  tag?: IngredientIconRenderType;
}) => {
  const Tag = tag!;

  return (
    <Tag
      className = { cs(styles[ingredientIconCls], className) }>
      <img
        alt = { ingredient.name }
        className = { styles[`${ingredientIconCls}__image`] }
        src = { ingredient.image } />
      { moreIngredientsCount ? (
        <div
          className = { cs(
            styles[
              `${ingredientIconCls}__more-ingredients-count`
            ],
            'text text_type_digits-default text_type_main-medium',
          ) }>
          +{ moreIngredientsCount }
        </div>
      ) : null }
    </Tag>
  );
};

export { IngredientIcon };
