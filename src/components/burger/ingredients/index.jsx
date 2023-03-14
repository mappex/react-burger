/* eslint-disable node/no-missing-import */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../../utils/lang';

import BurgerIngredientType from './ingredient-type';

import { useAppSelector } from '../../../services/store';
import { getMain } from '../../../services/selectors';

const ingredientTypeTitles = {
  bun: l('rolls'),
  sauce: l('sauces'),
  main: l('toppings'),
};
const ingredientTypes = Object.keys(ingredientTypeTitles);

const thresholdsStepsCount = 50;
const thresholds = [
  ...Array.from({ length: thresholdsStepsCount - 1 }).map(
    (_, ix) => ix / (thresholdsStepsCount - 1),
  ),
  1,
];

const BurgerIngredients = ({ className = '' }) => {
  const { ingredients } = useAppSelector(getMain);
  const [selectedIngredientType, setSelectedIngredientType] = useState(
    ingredientTypes[0],
  );
  const ingredientTypeToIngredientsMap = useMemo(() => {
    const axillaryMap = new Map();

    ingredients.forEach((ingredient) => {
      const { type } = ingredient;

      if (!axillaryMap.has(type)) {
        axillaryMap.set(type, []);
      }

      axillaryMap.get(type).push(ingredient);
    });

    const result = ingredientTypes.reduce((acc, ingredientType) => {
      if (axillaryMap.has(ingredientType)) {
        acc.set(ingredientType, axillaryMap.get(ingredientType));
      } else {
        acc.set(ingredientType, []);
      }

      return acc;
    }, new Map());

    axillaryMap.clear();

    return result;
  }, [ingredients]);
  const typeListElementRef = useRef(null);

  useEffect(() => {
    const { current: typeListElement } = typeListElementRef;

    const items = typeListElement.querySelectorAll(`.${styles['burger-ingredients__type-item']}`);

    if (items.length > 0) {
      const ingredientToIntersectionRatioMap = new Map();

      const intersectionObserver = new IntersectionObserver((intersectionObserverEntries) => {
        intersectionObserverEntries.forEach(({ target, intersectionRatio }) => {
          const {
            dataset: { type },
          } = target;

          if (type) {
            ingredientToIntersectionRatioMap.set(type, intersectionRatio);
          }
        });

        // eslint-disable-next-line max-len
        const mostVisibleType = [...ingredientToIntersectionRatioMap.entries()].sort(([, irA], [, irB]) => irB - irA)[0][0];

        setSelectedIngredientType(mostVisibleType);
      },
      {
        root: typeListElement,
        threshold: thresholds,
      });

      items.forEach((item) => {
        ingredientToIntersectionRatioMap.set(item.dataset.type, 0);
        intersectionObserver.observe(item);
      });

      return () => {
        intersectionObserver.disconnect();
        ingredientToIntersectionRatioMap.clear();
      };
    }
  }, []);

  return (
    <div className = { `${styles['burger-ingredients']} pb-5 ${className}` }>
      <div className = { `${styles['burger-ingredients__title']} pt-10 pb-5 text text_type_main-large` }>
        { l('assemble_burger') }
      </div>
      <div className = { styles['burger-ingredients__filter'] }>
        {
          ingredientTypes.map(type => (
            <Tab
              key = { type }
              active = { selectedIngredientType === type }
              value = { type }
              // eslint-disable-next-line @typescript-eslint/no-shadow
              onClick = { (type) => {
                const { current: typeListElement } = typeListElementRef;
                if (!typeListElement) return;

                const currentListItemElement = typeListElement.querySelector(
                  `.${styles['burger-ingredients__type-item']}[data-type="${type}"]`,
                );

                if (currentListItemElement) {
                  currentListItemElement.scrollIntoView({ behavior: 'smooth' });
                }
              } }>
              { ingredientTypeTitles[type] }
            </Tab>
          ))
        }
      </div>
      <ul
        ref = { typeListElementRef }
        className = { styles['burger-ingredients__type-list'] }>
        {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          Array.from(ingredientTypeToIngredientsMap.entries()).map(([type, ingredients]) => (
            <BurgerIngredientType
              key = { type }
              className = { styles['burger-ingredients__type-item'] }
              ingredients = { ingredients }
              title = { ingredientTypeTitles[type] }
              type = { type } />
          ))
        }
      </ul>
    </div>
  );
};

BurgerIngredients.propTypes = { className: PropTypes.string };

export default BurgerIngredients;
