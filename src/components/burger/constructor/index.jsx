import PropTypes from 'prop-types';
import { ConstructorElement, DragIcon, CurrencyIcon, Button } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';

function BurgerConstructor(props) {
  return (
    <>
      <ul className = { `${styles.burger_constructor_list} ml-4 mt-25 mb-10 pr-4` }>
        <li className = 'pl-8' key = 'top_bun'>
          <ConstructorElement
            type = 'top'
            isLocked = { true }
            text = { `${props.topItem.name} (верх)` }
            thumbnail = { props.topItem.image }
            price = { props.topItem.price } />
        </li>
        <ul className = { `${styles.burger_constructor_draggable_list} pr-2` } key = 'middle_items'>
          { props.middleItems.map((item, index) => (
            <li key = { `${item._id}_${index}` }>
              <span className = { styles.burger_constructor_drag_icon }>
                <DragIcon type = 'primary' />
              </span>
              <ConstructorElement
                text={item.name}
                thumbnail={item.image}
                price = { item.price } />
            </li>
          )) }
        </ul>
        <li className = 'pl-8' key = 'bottom_bun'>
          <ConstructorElement
            isLocked = { true }
            type = 'bottom'
            text = { `${props.bottomItem.name} (низ)` }
            thumbnail = { props.bottomItem.image }
            price = { props.bottomItem.price } />
        </li>
      </ul>
      <div className = { `${styles.burger_constructor_order} mr-4 mb-10` }>
        <p className = 'text text_type_digits-medium'>
          { props.topItem.price + props.middleItems.reduce((acc, p) => acc + p.price, 0) + props.bottomItem.price }
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
  topItem: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }),

  middleItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
    }),
  ),

  bottomItem: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }),
};

export { BurgerConstructor };
