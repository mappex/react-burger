import PropTypes from 'prop-types';
import {
  Counter,
  CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';

function OrderDetails({ item, onIngredientClick }) {
  const handleIngredientClick = () => {
    onIngredientClick(item);
  };

  return (
    <div className = { styles.ingredient_card } onClick = { handleIngredientClick }>
      { item.value ? <Counter count = { item.value } /> : null }
      <img
        src = { item.image } alt = { item.name }
        title = { item.name } className = 'ml-4 mr-4' />
      <div className = { `${styles.ingredient_price} mt-1 mb-1 ` }>
        <p className = 'pr-2 text text_type_digits-default'>{ item.price }</p>
        <CurrencyIcon />
      </div>
      <p className = { `${styles.ingredient_name} text text_type_main-default` }>
        { item.name }
      </p>
    </div>
  );
}

OrderDetails.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onIngredientClick: PropTypes.func.isRequired,
};

export default OrderDetails;
