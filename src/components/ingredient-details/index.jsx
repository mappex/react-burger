/* eslint-disable node/no-missing-import */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.css';
import l from '../../utils/lang';

const IngredientDetails = ({
  className,
  ingredient: {
    calories, carbohydrates, fat, image, name: title, proteins,
  },
}) => {
  const nutritionalValues = useMemo(() => {
    return {
      calories,
      carbohydrates,
      fat,
      proteins,
    };
  }, [calories, carbohydrates, fat, proteins]);

  return (
    <div className = { `${styles['ingredient-details']} mb-5 ${className}` }>
      <div
        className = { `${styles['ingredient-details__picture-wrapper']} pl-5 pr-5` }>
        <img
          alt = { title }
          className = { styles['ingredient-details__picture'] }
          src = { image } />
      </div>
      <div className = { 'pt-4' } />
      <div
        className = { `${styles['ingredient-details__title']} text text_type_main-medium` }>
        { title }
      </div>
      <div className = { 'pt-8' } />
      <div className = { styles['ingredient-details__nutritional-values'] }>
        { Object.entries(nutritionalValues).map(([key, value], ix, list) => (
          <React.Fragment key = { key }>
            <div className = { styles['ingredient-details__nutritional-value'] }>
              <div
                className = { styles['ingredient-details__nutritional-value-title'] }>
                { l(key) }
              </div>
              <div
                className = { `${styles['ingredient-details__nutritional-value-value']} text text_type_digits-default pt-2` }>
                { value }
              </div>
            </div>
            { ix + 1 < list.length ? <div className = { 'pl-5' } /> : null }
          </React.Fragment>
        )) }
      </div>
    </div>
  );
};

IngredientDetails.propTypes = {
  className: PropTypes.string,
  ingredient: PropTypes.object.isRequired,
};

export default IngredientDetails;
