import PropTypes from 'prop-types';
import {
  Counter,
  CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import {
  ingredientsType,
} from '../../../utils/prop-types';

function IngredientsDetails({
  value, image, name, price,
}) {
  return (
    <li className = { styles.ingredient }>
      { value ? <Counter count = { value } /> : null }
      <img
        src = { image } alt = { name }
        title = { name } className = 'ml-4 mr-4' />
      <div className = { `${styles.ingredient_price} mt-1 mb-1 ` }>
        <p className = 'pr-2 text text_type_digits-default'>{ price }</p>
        <CurrencyIcon />
      </div>
      <p className = { `${styles.ingredient_name} text text_type_main-default` }>{ name }</p>
    </li>
  );
}

IngredientsDetails.propTypes = {
  ...ingredientsType,
  value: PropTypes.number.isRequired,
};

export default IngredientsDetails;
