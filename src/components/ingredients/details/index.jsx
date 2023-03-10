import PropTypes from 'prop-types';

import styles from './index.module.css';
import l from '../../../utils/lang';
import {
  ingredientsType,
} from '../../../utils/prop-types';

function IngredientDetails({ item }) {
  return (
    <div className = { styles.ingredient_details_container }>
      <img
        src = { item.image_large }
        alt = { item.name }
        title = { item.name } />
      <h4 className = 'text text_type_main-medium mt-4 mb-8'>
        { item.name }
      </h4>
      <ul className = { styles.ingredient_nutrition_list }>
        <li className = { styles.ingredient_nutrition_list_item }>
          <p className = 'text text_type_main-default text_color_inactive'>
            { l('calories') }, { l('kcal') }
          </p>
          <p className = 'text text_type_digits-default text_color_inactive'>
            { item.calories }
          </p>
        </li>
        <li className = { styles.ingredient_nutrition_list_item }>
          <p className = 'text text_type_main-default text_color_inactive'>
            { l('proteins') }, { l('g') }
          </p>
          <p className = 'text text_type_digits-default text_color_inactive'>
            { item.proteins }
          </p>
        </li>
        <li className = { styles.ingredient_nutrition_list_item }>
          <p className = 'text text_type_main-default text_color_inactive'>
            { l('fats') }, { l('g') }
          </p>
          <p className = 'text text_type_digits-default text_color_inactive'>
            { item.fat }
          </p>
        </li>
        <li className = { styles.ingredient_nutrition_list_item }>
          <p className = 'text text_type_main-default text_color_inactive'>
            { l('carbohydrates') }, { l('g') }
          </p>
          <p className = 'text text_type_digits-default text_color_inactive'>
            { item.carbohydrates }
          </p>
        </li>
      </ul>
    </div>
  );
}

IngredientDetails.propTypes = {
  item: ingredientsType,
};

export default IngredientDetails;
