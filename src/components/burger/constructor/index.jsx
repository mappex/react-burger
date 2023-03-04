import PropTypes from 'prop-types';
import {
  ConstructorElement,
  DragIcon,
  CurrencyIcon,
  Button,
} from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import {
  ingredientsType,
} from '../../../utils/prop-types';


function BurgerConstructor({ topItem, middleItems, bottomItem }) {
  return (
    <>
      <ul className = { `${styles.burger_constructor_list} ml-4 mt-25 mb-10 pr-4` }>
        <li className = 'pl-8' key = 'top_bun'>
          <ConstructorElement
            type = 'top'
            isLocked = { true }
            text = { `${topItem.name} (верх)` }
            thumbnail = { topItem.image }
            price = { topItem.price } />
        </li>
        <ul className = { `${styles.burger_constructor_draggable_list} pr-2` } key = 'middle_items'>
          { middleItems.map((item, index) => (
            <li key = { `${item._id}_${index}` }>
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
        <li className = 'pl-8' key = 'bottom_bun'>
          <ConstructorElement
            isLocked = { true }
            type = 'bottom'
            text = { `${bottomItem.name} (низ)` }
            thumbnail = { bottomItem.image }
            price = { bottomItem.price } />
        </li>
      </ul>
      <div className = { `${styles.burger_constructor_order} mr-4 mb-10` }>
        <p className = 'text text_type_digits-medium'>
          { topItem.price + middleItems.reduce((acc, p) => acc + p.price, 0) + bottomItem.price }
        </p>
        <span className = 'ml-2 mr-10'>
          <CurrencyIcon type = 'primary' />
        </span>
        <Button type = 'primary' size = 'medium'>
          Оформить заказ
        </Button>
      </div>
    </>
  );
}


BurgerConstructor.propTypes = {
  topItem: ingredientsType,

  middleItems: PropTypes.arrayOf(
    PropTypes.shape({
      ...ingredientsType,
      _id: PropTypes.string.isRequired,
    }),
  ),

  bottomItem: ingredientsType,
};

export { BurgerConstructor };
