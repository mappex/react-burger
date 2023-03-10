import PropTypes from 'prop-types';

import styles from './index.module.css';
import l from '../../../utils/lang';
import {
  ingredientsType,
} from '../../../utils/prop-types';

// eslint-disable-next-line node/no-missing-import
import Description from '../description';

function IngredientsCategory({ title, items }) {
  return (
    <section>
      <h2 className = 'text text_type_main-medium mt-10 mb-6'>
        { title }
      </h2>
      { (items.length > 0
        ? <ul className = { `${styles.burger_ingredients_list} ml-4 mt-6 mr-2 mb-10` }>
          { items.map(item => (
            <li key = { item._id }>
              <Description
                key = { item._id }
                item = { item } />
            </li>
          )) }
        </ul>
        : <h3 className = 'text text_type_main-default text_color_inactive pb-6'>
          { l('category') } { l('empty') }
        </h3>) }
    </section>
  );
}

IngredientsCategory.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(ingredientsType),
};

export default IngredientsCategory;
