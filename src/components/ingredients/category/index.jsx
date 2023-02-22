import PropTypes from 'prop-types';

import styles from './index.module.css';

// eslint-disable-next-line node/no-missing-import
import IngredientsDetails from '../details';

function IngredientsCategory(props) {
  return (
    <section>
      <h2 className = 'text text_type_main-medium mt-10 mb-6'>
        { props.heading }
      </h2>
      <ul className = { `${styles.burger_ingredients_list} ml-4 mt-6 mr-2 mb-10` }>
        { props.items.map(item =>
          <IngredientsDetails
            name = { item.name } price = { item.price }
            image = { item.image } value = { item.__v }
            key = { item._id } />) }
      </ul>
    </section>
  );
}

IngredientsCategory.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    __v: PropTypes.number.isRequired,
  }).isRequired).isRequired,
};

export { IngredientsCategory };
