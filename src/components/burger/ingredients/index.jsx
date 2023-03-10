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
import { IngredientType as Type } from '../../../utils/consts';

// eslint-disable-next-line node/no-missing-import
import IngredientsCategory from '../../ingredients/category';

function BurgerIngredients() {
  const [current, setCurrent] = useState(Type.BUN);
  const { items } = useContext(BurgerContext);

  return (
    <>
      <h1 className = 'text text_type_main-large mt-10 mb-5'>
        { l('assemble_burger') }
      </h1>
      <div className = { styles.tab_selector }>
        <Tab
          value = { Type.BUN }
          active = { current === Type.BUN }
          onClick = { setCurrent }>
          { l('rolls') }
        </Tab>
        <Tab
          value = { Type.SAUCE }
          active = { current === Type.SAUCE }
          onClick = { setCurrent }>
          { l('sauces') }
        </Tab>
        <Tab
          value = { Type.MAIN }
          active = { current === Type.MAIN }
          onClick = { setCurrent }>
          { l('toppings') }
        </Tab>
      </div>
      <div className = { styles.scroll_container }>
        <IngredientsCategory
          title = { l('rolls') }
          items = { items.filter(item => item.type === Type.BUN) } />
        <IngredientsCategory
          title = { l('sauces') }
          items = { items.filter(item => item.type === Type.SAUCE) } />
        <IngredientsCategory
          title = { l('toppings') }
          items = { items.filter(item => item.type === Type.MAIN) } />
      </div>
    </>
  );
}

BurgerIngredients.propTypes = {
  items: PropTypes.arrayOf(ingredientsType),
};

export { BurgerIngredients };
