import React from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';

// eslint-disable-next-line node/no-missing-import
import { IngredientsCategory } from '../../ingredients';
import {
  ingredientsType,
} from '../../../utils/prop-types';

function BurgerIngredients({ items }) {
  const [current, setCurrent] = React.useState('bun');

  return (
    <>
      <h1 className = 'text text_type_main-large mt-10 mb-5'>
        Соберите бургер
      </h1>
      <div className = { styles.tab_selector }>
        <Tab
          value = 'bun' active = { current === 'bun' }
          onClick = { setCurrent }>
          Булки
        </Tab>
        <Tab
          value = 'sauce' active = { current === 'sauce' }
          onClick = { setCurrent }>
          Соусы
        </Tab>
        <Tab
          value = 'main' active = { current === 'main' }
          onClick = { setCurrent }>
          Начинки
        </Tab>
      </div>
      <div className = { styles.scroll_container }>
        <IngredientsCategory heading = 'Булки' items = { items.filter(item => item.type === 'bun') } />
        <IngredientsCategory heading = 'Соусы' items = { items.filter(item => item.type === 'sauce') } />
        <IngredientsCategory heading = 'Начинки' items = { items.filter(item => item.type === 'main') } />
      </div>
    </>
  );
}

BurgerIngredients.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    ...ingredientsType,
    type: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};

export { BurgerIngredients };
