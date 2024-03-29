import { useMemo } from 'react';

import {
  useAppSelector,
} from '../services/store';
import {
  getIngredients,
} from '../services/selectors';
import {
  TIngredient,
  IngredientType,
  Order,
} from '../utils/types';

const getOrderIngredientEntries = (ingredients: TIngredient[]) => {
  const bun = ingredients.find(({ type }) => type === IngredientType.BUN);
  const ingredientsWithoutABun = ingredients.filter(({ type }) => type !== IngredientType.BUN);
  const ingredientToQuantityMap: Map<TIngredient, number> = new Map();

  if (bun) {
    ingredientToQuantityMap.set(bun, 2);
  }

  ingredientsWithoutABun.forEach((ingredient) => {
    if (!ingredientToQuantityMap.has(ingredient)) {
      ingredientToQuantityMap.set(ingredient, 0);
    }

    const currentQuantity = ingredientToQuantityMap.get(ingredient)!;

    ingredientToQuantityMap.set(ingredient, currentQuantity + 1);
  });

  return [...ingredientToQuantityMap.entries()];
};

export const useOrderIngredients = ({
  limit = Infinity,
  order,
}: {
  limit?: number;
  order: Order;
}) => {
  const { idToIngredientMap } = useAppSelector(getIngredients);

  return useMemo(() => {
    if (!order) {
      return {
        ingredientQuantityPairs: [],
        moreIngredientsCount: 0,
        totalPrice: 0,
      };
    }

    const ingredients = order.ingredients.map(ingredientId => idToIngredientMap[ingredientId]);
    const areThereSomeUndefinedIngredients = ingredients.some(ingredient => ingredient === null);

    if (areThereSomeUndefinedIngredients) {
      return {
        ingredientQuantityPairs: [],
        isItValid: false,
        moreIngredientsCount: ingredients.length,
        totalPrice: NaN,
      };
    }

    const ingredientQuantityPairs = getOrderIngredientEntries(ingredients);

    return {
      ingredientQuantityPairs: ingredientQuantityPairs.slice(0, limit),
      isItValid: true,
      moreIngredientsCount: limit < ingredientQuantityPairs.length ? ingredientQuantityPairs.length - limit : 0,
      totalPrice: ingredientQuantityPairs.reduce(
        (result, [{ price }, quantity]) => result + (price * quantity),
        0,
      ),
    };
  }, [idToIngredientMap, limit, order]);
};
