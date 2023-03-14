/* eslint-disable node/no-missing-import */
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../../utils/lang';

import Amount from '../../amount';
import BurgerConstructorItem from './item';

import {
  DraggableTypes,
  IngredientType,
} from '../../../utils/types';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../services/store';
import {
  addIngredient,
  createOrder,
  removeIngredient,
  setDetailedIngredient,
} from '../../../services/reducers';

const BurgerConstructor = ({ className }) => {
  const dispatch = useAppDispatch();
  const {
    actualIngredients,
    idToIngredientMap,
    orderDetailsRequest,
    totalAmount,
  } = useAppSelector(state => state.main);

  const topBun = actualIngredients.slice(0, 1)[0];
  const bottomBun = actualIngredients.slice(-1)[0];

  const createOrderClickHandler = useCallback(() => {
    if (!orderDetailsRequest) {
      dispatch(createOrder(actualIngredients.map(({ refId }) => refId)));
    }
  }, [actualIngredients, dispatch, orderDetailsRequest]);

  const [{ isCanDrop, isDragOver }, dropRef] = useDrop({
    accept: DraggableTypes.INGREDIENT,
    canDrop(item, monitor) {
      return !(
        actualIngredients.length === 0
        && monitor.getItemType() === DraggableTypes.INGREDIENT
        && item.type !== IngredientType.BUN
      );
    },
    drop(item) {
      const { refId } = item;

      dispatch(addIngredient(idToIngredientMap[refId]));
    },
    collect(monitor) {
      return {
        isCanDrop: monitor.canDrop(),
        isDragOver: monitor.isOver(),
      };
    },
  });

  let style = `${styles['burger-constructor']} pt-25 pb-5`;

  if (actualIngredients.length === 0) {
    style += ` ${styles['burger-constructor_is-empty']}`;
  }

  if (isCanDrop) {
    style += ` ${styles['burger-constructor_is-can-drop']}`;
  }

  if (isDragOver) {
    style += ` ${styles['burger-constructor_is-drag-over']}`;
  }

  return (
    <div
      className = { `${style} ${className}` }>
      <div ref = { dropRef } className = { styles['burger-constructor__list'] }>
        {
          topBun && (
            <>
              { (() => {
                const { isLocked = false, refId, type } = topBun;
                const ingredient = idToIngredientMap[refId];

                return (
                  ingredient && (
                    <BurgerConstructorItem
                      ingredient = { idToIngredientMap[refId] || null }
                      isLocked = { isLocked }
                      onShowIngredientInfo = { () => {
                        dispatch(setDetailedIngredient(ingredient));
                      } }
                      type = { type } />
                  )
                );
              })() }
              <div className = { 'pt-4' } />
            </>)
        }
        <div className = { styles['burger-constructor__filling'] }>
          {
            actualIngredients
              .slice(1, -1)
              .map(({
                id, isLocked = false, refId, type,
              }, ix) => {
                const ingredient = idToIngredientMap[refId];

                return (
                  ingredient && (
                    <BurgerConstructorItem
                      key = { id }
                      id = { id }
                      index = { ix + 1 }
                      ingredient = { idToIngredientMap[refId] || null }
                      isLocked = { isLocked }
                      onShowIngredientInfo = { () => {
                        dispatch(setDetailedIngredient(ingredient));
                      } }
                      onDelete = { () => { dispatch(removeIngredient(id)); } }
                      type = { type } />
                  )
                );
              })
          }
        </div>
        {
          bottomBun && (
            <>
              <div className = { 'pt-4' } />
              { (() => {
                const { isLocked = false, refId, type } = bottomBun;
                const ingredient = idToIngredientMap[refId];

                return (
                  ingredient && (
                    <BurgerConstructorItem
                      ingredient = { idToIngredientMap[refId] || null }
                      isLocked = { isLocked }
                      onShowIngredientInfo = { () => {
                        dispatch(setDetailedIngredient(ingredient));
                      } }
                      type = { type } />
                  )
                );
              })() }
            </>)
        }
      </div>
      <div className = { `${styles['burger-constructor__total-wrapper']} pt-10` }>
        <Amount
          amount = { totalAmount }
          className = { styles['burger-constructor__total'] }
          isTotal = { true } />
        <div className = { 'pl-10' } />
        <Button
          htmlType = 'button'
          onClick = { createOrderClickHandler }
          size = { 'large' }
          type = { 'primary' }>
          { l('checkout') }
        </Button>
      </div>
    </div>
  );
};

BurgerConstructor.propTypes = { className: PropTypes.string };

export default BurgerConstructor;
