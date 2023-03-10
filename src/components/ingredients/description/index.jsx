import {
  memo,
  useContext,
} from 'react';
import {
  Counter,
  CurrencyIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import {
  ingredientsType,
} from '../../../utils/prop-types';
import { BurgerContext } from '../../../utils/context/burger';

function Description({ item }) {
  const { onIngredientClick } = useContext(BurgerContext);

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

Description.propTypes = {
  item: ingredientsType.isRequired,
};

export default memo(Description);
