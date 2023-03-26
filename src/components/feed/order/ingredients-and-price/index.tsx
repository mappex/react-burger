import {
  IngredientIcon,
  IngredientIconRenderType,
} from '../../../ingredient/icon';
import { Amount } from '../../../amount';

import { Order } from '../../../../utils/types';
import { useOrderIngredients } from '../../../../hooks';

import styles from './index.module.css';
import l from '../../../../utils/lang';

const ingredientsAndPriceClassname = 'ingredients-and-price';
const ingredientsToRenderLimit = 6;

const IngredientsAndPrice = ({ order }: { order: Order }) => {
  const {
    ingredientQuantityPairs,
    isItValid,
    moreIngredientsCount,
    totalPrice,
  } = useOrderIngredients({
    limit: 6,
    order,
  });

  return (
    <div className = { styles[ingredientsAndPriceClassname] }>
      { isItValid ? (
        <>
          <ul
            className = {
              styles[
                `${ingredientsAndPriceClassname}__ingredients`
              ]
            }>
            { ingredientQuantityPairs.map(([ingredient], ix) => (
              <IngredientIcon
                key = { ingredient._id }
                className = {
                  styles[
                    `${ingredientsAndPriceClassname}__ingredient`
                  ]
                }
                ingredient = { ingredient }
                moreIngredientsCount = {
                  moreIngredientsCount > 0
                  && ix + 1 === ingredientsToRenderLimit
                    ? moreIngredientsCount
                    : undefined
                }
                tag = { IngredientIconRenderType.li } />
            )) }
          </ul>
          <div className = { 'pl-6' } />
          <div
            className = {
              styles[
                `${ingredientsAndPriceClassname}__price`
              ]
            }>
            <Amount amount = { totalPrice } />
          </div>
        </>
      ) : (
        <div className = { 'text text_color_error' }>{ l('order_no_information') }</div>
      ) }
    </div>
  );
};

export { IngredientsAndPrice };
