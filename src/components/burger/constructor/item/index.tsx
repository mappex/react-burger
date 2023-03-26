import cs from 'classnames';
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
  TIngredient,
  DraggableTypes,
  ActualIngredientType,
  TActualIngredientDragItem,
} from '../../../../utils/types';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../../services/store';
import { moveIngredient } from '../../../../services/reducers/ingredients';
import {
  getOrderDetails,
} from '../../../../services/selectors';

const BurgerConstructorItem = ({
  className,
  index,
  ingredient: { _id, image, name, price },
  isLocked,
  onShowIngredientInfo,
  onDelete,
  type,
}: {
  className?: string;
  index?: number;
  ingredient: TIngredient;
  isLocked: boolean;
  onShowIngredientInfo?: () => void;
  onDelete?: () => void;
  type?: ActualIngredientType;
}) => {
  const dispatch = useAppDispatch();
  const orderDetailsRequest = useAppSelector(getOrderDetails);

  const [{ isItPicked }, dragRef, preview] = useDrag({
    type: DraggableTypes.ACTUALINGREDIENT,
    canDrag: !isLocked && !orderDetailsRequest,
    item: {
      index,
    } as TActualIngredientDragItem,
    collect(monitor) {
      return {
        isItPicked: monitor.isDragging(),
      };
    },
  });

  const [{ isCanDrop, isDragOver }, dropRef] = useDrop({
    accept: DraggableTypes.ACTUALINGREDIENT,
    canDrop() {
      return !isLocked && !orderDetailsRequest;
    },
    collect(monitor) {
      return {
        isCanDrop: monitor.canDrop(),
        isDragOver: monitor.isOver(),
      };
    },
    hover(item: TActualIngredientDragItem) {
      const { index: draggableIndex } = item as TActualIngredientDragItem;

      if (index === draggableIndex) {
        return;
      }

      if (index) {
        item.index = index;
        dispatch(moveIngredient([draggableIndex, index]));
      }
    },
  });

  return (
    <div
      ref = { dropRef }
      className = { cs(
        styles['burger-constructor-item'],
        {
          [styles['burger-constructor-item_interactive']]: onShowIngredientInfo,
          [styles['burger-constructor-item_is-picked']]: isItPicked,
          [styles['burger-constructor-item_is-can-drop']]: isCanDrop,
          [styles['burger-constructor-item_is-drag-over']]: isDragOver,
          'pt-4': !isLocked,
        },
        className,
      ) }
      onClick = { (event) => {
        const target = event.target as HTMLElement;

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

export default BurgerConstructorItem;
