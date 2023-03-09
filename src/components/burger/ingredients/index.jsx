import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../../utils/lang';
import {
  ingredientsType,
} from '../../../utils/prop-types';

// eslint-disable-next-line node/no-missing-import
import IngredientsCategory from '../../ingredients/category';

function BurgerIngredients({ items, onIngredientClick }) {
  const [current, setCurrent] = React.useState('bun');

  return (
    <>
      <h1 className = 'text text_type_main-large mt-10 mb-5'>
        { l('assemble_burger') }
      </h1>
      <div className = { styles.tab_selector }>
        <Tab
          value = 'bun'
          active = { current === 'bun' }
          onClick = { setCurrent }>
          { l('rolls') }
        </Tab>
        <Tab
          value = 'sauce'
          active = { current === 'sauce' }
          onClick = { setCurrent }>
          { l('sauces') }
        </Tab>
        <Tab
          value = 'main'
          active = { current === 'main' }
          onClick = { setCurrent }>
          { l('toppings') }
        </Tab>
      </div>
      <div className = { styles.scroll_container }>
        <IngredientsCategory
          heading = { l('rolls') }
          items = { items.filter(item => item.type === 'bun') }
          onIngredientClick = { onIngredientClick } />
        <IngredientsCategory
          heading = { l('sauces') }
          items = { items.filter(item => item.type === 'sauce') }
          onIngredientClick = { onIngredientClick } />
        <IngredientsCategory
          heading = { l('toppings') }
          items = { items.filter(item => item.type === 'main') }
          onIngredientClick = { onIngredientClick } />
      </div>
    </>
  );
}

BurgerIngredients.propTypes = {
  items: PropTypes.arrayOf(ingredientsType),
};

export { BurgerIngredients };
