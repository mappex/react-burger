/* eslint-disable node/no-missing-import */
import PropTypes from 'prop-types';
import {
  DragPreviewImage,
  useDrag,
  useDrop,
} from 'react-dnd';
import {
  ConstructorElement,
  DragIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../../../utils/lang';

import {
  DraggableTypes,
  ActualIngredientType,
} from '../../../../utils/types';

import { useAppDispatch } from '../../../../services/store';
import { moveIngredient } from '../../../../services/reducers/ingredients';

const BurgerConstructorItem = ({
  className, index, ingredient: {
    _id, image, name, price,
  }, isLocked, onShowIngredientInfo, onDelete, type,
}) => {
  const dispatch = useAppDispatch();

  const [{ isItPicked }, dragRef, preview] = useDrag({
    type: DraggableTypes.ACTUALINGREDIENT,
    canDrag: !isLocked,
    item: {
      index,
    },
    collect(monitor) {
      return {
        isItPicked: monitor.isDragging(),
      };
    },
  });

  const [{ isCanDrop, isDragOver }, dropRef] = useDrop({
    accept: DraggableTypes.ACTUALINGREDIENT,
    canDrop(item) {
      const { index: draggableIndex } = item;

      return !isLocked && index !== draggableIndex;
    },
    collect(monitor) {
      return {
        isCanDrop: monitor.canDrop(),
        isDragOver: monitor.isOver(),
      };
    },
    hover(item) {
      const { index: draggableIndex } = item;
      if (index === draggableIndex) {
        return;
      }

      if (index !== null) {
        // eslint-disable-next-line no-param-reassign
        item.index = index;
        setImmediate(() => dispatch(moveIngredient([draggableIndex, index])));
      }
    },
  });


  let style = styles['burger-constructor-item'];

  if (onShowIngredientInfo) {
    style += ` ${styles['burger-constructor-item_interactive']}`;
  }

  if (isItPicked) {
    style += ` ${styles['burger-constructor-item_is-picked']}`;
  }

  if (isCanDrop) {
    style += ` ${styles['burger-constructor-item_is-can-drop']}`;
  }

  if (isDragOver) {
    style += ` ${styles['burger-constructor-item_is-drag-over']}`;
  }

  if (!isLocked) {
    style += ' pt-4';
  }

  return (
    <div
      ref = { dropRef }
      className = { `${style} ${className}` }
      onClick = { (event) => {
        const { target } = event;
        if (
          onShowIngredientInfo
          && target.closest(`.${styles['burger-constructor-item__constructor-element-wrapper']}`)
          && !target.closest('.constructor-element__action')
        ) {
          onShowIngredientInfo();
        }
      } }>
      {
        !isLocked ? (
          <div ref = { dragRef }>
            <DragIcon type = { 'primary' } />
          </div>
        ) : (
          <div className = { 'pl-8' } />
        )
      }
      <DragPreviewImage connect = { preview } src = { image } />
      <div className = { 'pl-6' } />
      <div className = { styles['burger-constructor-item__constructor-element-wrapper'] }>
        <ConstructorElement
          handleClose = { onDelete }
          isLocked = { isLocked }
          price = { price }
          text = { `${name} ${type ? ` (${type === ActualIngredientType.TOP ? l('top') : l('bottom')})` : ''}` }
          thumbnail = { image }
          type = { type } />
      </div>
    </div>
  );
};

BurgerConstructorItem.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  index: PropTypes.number,
  ingredient: PropTypes.object.isRequired,
  isLocked: PropTypes.bool.isRequired,
  onShowIngredientInfo: PropTypes.func,
  onDelete: PropTypes.func,
  type: PropTypes.oneOf([
    ActualIngredientType.TOP,
    ActualIngredientType.BOTTOM,
  ]),
};

export default BurgerConstructorItem;
