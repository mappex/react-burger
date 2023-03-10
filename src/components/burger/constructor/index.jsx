import {
  useContext,
  useReducer,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../../utils/lang';
import {
  ingredientsType,
} from '../../../utils/prop-types';
import { BurgerContext } from '../../../utils/context/burger';

const initialTotalState = { total: 0 };

function totalPriceReducer(totalPriceState, items) {
  const newTotal = items.bunItem.price * 2 + items.middleItems.reduce((acc, p) => acc + p.price, 0);

  return { total: newTotal };
}

function BurgerConstructor() {
  const { orderedItems, onOrderButtonClick } = useContext(BurgerContext);
  const [totalPriceState, totalPriceDispatch] = useReducer(totalPriceReducer, initialTotalState);

  useEffect(() => {
    totalPriceDispatch(orderedItems);
  }, [orderedItems]);

  const { bunItem, middleItems } = orderedItems;

  return (
    <>
      <ul className = { `${styles.burger_constructor_list} ml-4 mt-25 mb-10 pr-4` }>
        <li className = 'pl-8' key = 'top_bun'>
          <ConstructorElement
            type = 'top'
            isLocked = { true }
            text = { `${bunItem.name} (${l('top')})` }
            thumbnail = { bunItem.image }
            price = { bunItem.price } />
        </li>
        <li>
          { (middleItems.length > 0
            ? <ul className = { `${styles.burger_constructor_draggable_list} pr-2` } key = 'middle_items'>
              { middleItems.map(item => (
                <li
                  className = { styles.burger_constructor_draggable_list_item }
                  key = { item._id }>
                  <span className = { styles.burger_constructor_drag_icon }>
                    <DragIcon type = 'primary' />
                  </span>
                  <ConstructorElement
                    text = { item.name }
                    thumbnail = { item.image }
                    price = { item.price } />
                </li>
              )) }
            </ul>
            : <h3 className = { `${styles.warningText} text text_type_main-default text_color_inactive pt-6 pb-6` }>
              { l('add_ingredients') }
            </h3>
          ) }
        </li>
        <li className = 'pl-8' key = 'bottom_bun'>
          <ConstructorElement
            isLocked = { true }
            type = 'bottom'
            text = { `${bunItem.name} (${l('bottom')})` }
            thumbnail = { bunItem.image }
            price = { bunItem.price } />
        </li>
      </ul>
      <div className = { `${styles.burger_constructor_order} mr-4 mb-10` }>
        <p className = 'text text_type_digits-medium'>
          { totalPriceState.total }
        </p>
        <span className = 'ml-2 mr-10'>
          <CurrencyIcon type = 'primary' />
        </span>
        <Button
          htmlType = 'button'
          type = 'primary'
          size = 'medium'
          onClick = { onOrderButtonClick }>
          { l('checkout') }
        </Button>
      </div>
    </>
  );
}

BurgerConstructor.propTypes = {
  bunItem: ingredientsType,
  middleItems: PropTypes.arrayOf(ingredientsType),
};

export { BurgerConstructor };
