import PropTypes from 'prop-types';

import styles from './index.module.css';

// eslint-disable-next-line node/no-missing-import
import IngredientsDetails from '../details';
import {
  ingredientsType,
} from '../../../utils/prop-types';

function IngredientsCategory({ heading, items }) {
  return (
    <section>
      <h2 className = 'text text_type_main-medium mt-10 mb-6'>
        { heading }
      </h2>
      <ul className = { `${styles.burger_ingredients_list} ml-4 mt-6 mr-2 mb-10` }>
        { items.map(item =>
          <IngredientsDetails
            name = { item.name }
            price = { item.price }
            image = { item.image }
            value = { item.__v }
            key = { item._id } />)
        }
      </ul>
    </section>
  );
}

IngredientsCategory.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    ...ingredientsType,
    _id: PropTypes.string.isRequired,
    __v: PropTypes.number.isRequired,
  }).isRequired).isRequired,
};

export { IngredientsCategory };
