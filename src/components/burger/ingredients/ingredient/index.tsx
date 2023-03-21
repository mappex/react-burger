import cs from 'classnames';
import PropTypes from 'prop-types';
import {
  DragPreviewImage,
  useDrag,
} from 'react-dnd';
import { Counter } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';

import { Amount } from '../../../amount';

import {
  Ingredient_t,
  DraggableTypes,
  IngredientDragItem,
} from '../../../../utils/types';
import { useAppSelector } from '../../../../services/store';
import { getIngredients } from '../../../../services/selectors';

const BurgerIngredient = ({
  ingredient: { _id, image, name: title, price, type },
  onClick,
}: {
  ingredient: Ingredient_t;
  onClick?: () => void;
}) => {
  const { idToActualIngredientsCountMap } = useAppSelector(getIngredients);

  const [{ isItPicked }, dragRef, preview] = useDrag({
    type: DraggableTypes.INGREDIENT,
    options: {
      dropEffect: 'copy',
    },
    item: {
      refId: _id,
      type,
    } as IngredientDragItem,
    collect(monitoring) {
      return {
        isItPicked: monitoring.isDragging(),
      };
    },
  });

  return (
    <li
      ref = { dragRef }
      className = { cs(styles['burger-ingredient'], {
        [styles['burger-ingredient_interactive']]: onClick,
        [styles['burger-ingredient_is-picked']]: isItPicked,
      }) }
      onClick = { onClick }>
      <DragPreviewImage connect = { preview } src = { image } />
      {
        idToActualIngredientsCountMap[_id] && (
          <Counter count = { idToActualIngredientsCountMap[_id] } />
        )
      }
      <div>
        <div
          className = { `${styles['burger-ingredient__image-wrapper']} pl-4 pr-4` }>
          <img
            alt = { title }
            className = { styles['burger-ingredient__image'] }
            src = { image } />
        </div>
        <Amount
          amount = { price }
          className = { `${styles['burger-ingredient__price-wrapper']} pt-1 pb-1` } />
        <div className = { styles['burger-ingredient__title'] }>{ title }</div>
      </div>
    </li>
  );
};

BurgerIngredient.propTypes = {
  ingredient: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default BurgerIngredient;
