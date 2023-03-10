import {
  useState,
  useContext,
} from 'react';
import PropTypes from 'prop-types';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../../utils/lang';
import {
  ingredientsType,
} from '../../../utils/prop-types';
import { BurgerContext } from '../../../utils/context/burger';

// eslint-disable-next-line node/no-missing-import
import IngredientsCategory from '../../ingredients/category';

function BurgerIngredients() {
  const [current, setCurrent] = useState('bun');
  const { items } = useContext(BurgerContext);

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
          title = { l('rolls') }
          items = { items.filter(item => item.type === 'bun') } />
        <IngredientsCategory
          title = { l('sauces') }
          items = { items.filter(item => item.type === 'sauce') } />
        <IngredientsCategory
          title = { l('toppings') }
          items = { items.filter(item => item.type === 'main') } />
      </div>
    </>
  );
}

BurgerIngredients.propTypes = {
  items: PropTypes.arrayOf(ingredientsType),
};

export { BurgerIngredients };
