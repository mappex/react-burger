import { FC,
  useMemo,
  useCallback,
} from 'react';
import { useDrop } from 'react-dnd';
import cs from 'classnames';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../../utils/lang';
import r from '../../../utils/routes';

import { Amount } from '../../amount';
import BurgerConstructorItem from './item';

import {
  DraggableTypes,
  IngredientType,
  TActualIngredient,
  TIngredientDragItem,
} from '../../../utils/types';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../services/store';
import {
  addIngredient,
  removeIngredient,
  resetIngredients,
} from '../../../services/reducers/ingredients';
import { createOrder } from '../../../services/reducers/order-details';

import {
  getUser,
  getIngredients,
  getOrderDetails,
} from '../../../services/selectors';

const BurgerConstructor: FC<{ className?: string }> = ({ className }) => {
  const dispatch = useAppDispatch();
  const {
    actualIngredients,
    idToIngredientMap,
  } = useAppSelector(getIngredients);
  const { orderDetailsRequest } = useAppSelector(getOrderDetails);
  const { user } = useAppSelector(getUser);
  const { state, pathname } = useLocation();
  const url = window.location.href;
  const navigate = useNavigate();

  const topBun = actualIngredients.slice(0, 1)[0];
  const bottomBun = actualIngredients.slice(-1)[0];

  const totalAmount = useMemo(() => {
    const ingredientIds = actualIngredients.map(({ refId }: TActualIngredient) => refId);

    return ingredientIds.reduce((result: number, refId: string) => {
      const { price } = idToIngredientMap[refId] || 0;

      return result + price;
    }, 0);
  }, [actualIngredients, idToIngredientMap]);

  const createOrderClickHandler = useCallback(() => {
    if (!user) {
      navigate(r.login);
    } else if (!orderDetailsRequest) {
      const orderIngredients = actualIngredients.map(({ refId }: TActualIngredient) => refId);

      // eslint-disable-next-line promise/catch-or-return, promise/always-return
      dispatch(createOrder(orderIngredients)).then(() => {
        dispatch(resetIngredients());
      });
    }
  }, [actualIngredients, dispatch, orderDetailsRequest, user, state, pathname, url]);

  const [{ isCanDrop, isDragOver }, dropRef] = useDrop({
    accept: DraggableTypes.INGREDIENT,
    canDrop(item: TIngredientDragItem, monitor) {
      return !(
        actualIngredients.length === 0
        && monitor.getItemType() === DraggableTypes.INGREDIENT
        && item.type !== IngredientType.BUN);
    },
    drop(item) {
      const { refId } = item as TIngredientDragItem;

      if (!orderDetailsRequest) {
        dispatch(addIngredient(idToIngredientMap[refId]));
      }
    },
    collect(monitor) {
      return {
        isCanDrop: monitor.canDrop() && !orderDetailsRequest,
        isDragOver: monitor.isOver(),
      };
    },
  });

  return (
    <div
      data-test-id = 'burger-constructor'
      className = { cs(
        styles['burger-constructor'],
        'pt-25 pb-5',
        {
          [styles['burger-constructor_is-empty']]:
          actualIngredients.length === 0,
          [styles['burger-constructor_is-can-drop']]: isCanDrop,
          [styles['burger-constructor_is-drag-over']]: isDragOver,
        },
        className,
      ) }>
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
                        navigate(`/ingredients/${ingredient._id}`, {
                          state: {
                            background: true,
                          },
                        });
                      } }
                      type = { type } />
                  )
                );
              })() }
              <div className = { 'pt-4' } />
            </>)
        }
        <div
          data-test-id = 'burger-constructor-filling'
          className = { styles['burger-constructor__filling'] }>
          {
            actualIngredients
              .slice(1, -1)
              .map(({
                id, isLocked = false, refId, type,
              }: TActualIngredient, ix: number) => {
                const ingredient = idToIngredientMap[refId];

                return (
                  ingredient && (
                    <BurgerConstructorItem
                      key = { id }
                      index = { ix + 1 }
                      ingredient = { idToIngredientMap[refId] || null }
                      isLocked = { isLocked }
                      onShowIngredientInfo = { () => {
                        navigate(`/ingredients/${ingredient._id}`, {
                          state: {
                            background: true,
                          },
                        });
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
                        navigate(`/ingredients/${ingredient._id}`, {
                          state: {
                            background: true,
                          },
                        });
                      } }
                      type = { type } />
                  )
                );
              })() }
            </>)
        }
      </div>
      <div
        className = { cs(styles['burger-constructor__total-wrapper'], 'pt-10') }
        data-test-id = 'total-wrapper'>
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

export { BurgerConstructor };
