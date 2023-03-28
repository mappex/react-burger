import React from 'react';
import cs from 'classnames';
import { useParams } from 'react-router-dom';

import { Amount } from '../../amount';
import { OrderStatus } from '../status';

import { formatOrderDate } from '../../../helpers';
import { useOrderIngredients } from '../../../hooks';
import { useAppSelector } from '../../../services/store';
import { IngredientAndPrice } from './ingredients-and-price';

import styles from './index.module.css';
import l from '../../../utils/lang';

const orderDetailsCls = 'order-details';

const OrderDetails = () => {
  const { id } = useParams() as { id: string };
  const orders = useAppSelector(state => state.orders.orders);
  const order = orders.find(({ _id }) => id === _id)!;
  const { ingredientQuantityPairs, isItValid, totalPrice }
    = useOrderIngredients({
      order,
    });

  if (!order) {
    return null;
  }

  return (
    <div className = { styles[orderDetailsCls] }>
      <div
        className = { cs(
          styles[`${orderDetailsCls}__number`],
          'text text_type_digits-default',
        ) }>
        #{ order.number }
      </div>
      <div className = { 'pt-10' } />
      <div className = { 'text text_type_main-medium' }>{ order.name }</div>
      <div className = { 'pt-3' } />
      <OrderStatus status = { order.status } />
      <div className = { 'pt-15' } />
      <div className = { 'text text_type_main-medium' }>
        { l('order_ingredients') }:
      </div>
      <div className = { 'pt-6' } />
      { isItValid ? (
        <ul
          className = { cs(
            styles[`${orderDetailsCls}__ingredients`],
            'custom-scroll',
          ) }>
          { ingredientQuantityPairs.map(([ingredient, quantity], ix) => (
            <React.Fragment key = { ix }>
              <IngredientAndPrice ingredient = { ingredient } quantity = { quantity } />
              { ix + 1 < ingredientQuantityPairs.length ? (
                <div className = { 'pt-4' } />
              ) : null }
            </React.Fragment>
          )) }
        </ul>
      ) : (
        <div className = { 'text text_color_error' }>{ l('order_no_information') }</div>
      ) }
      <div className = { 'pt-10' } />
      <div
        className = { cs(
          styles[
            `${orderDetailsCls}__date-and-price-wrapper`
          ],
          'mr-6',
        ) }>
        <div
          className = { cs(
            styles[`${orderDetailsCls}__date`],
            'text text_color_inactive',
          ) }>
          { formatOrderDate(order.createdAt) }
        </div>
        { isItValid ? (
          <div
            className = { styles[`${orderDetailsCls}__price`] }>
            <Amount amount = { totalPrice } />
          </div>
        ) : null }
      </div>
    </div>
  );
};

export { OrderDetails };
