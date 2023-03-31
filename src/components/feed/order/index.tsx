import React, { FC } from 'react';
import cs from 'classnames';
import {
  useNavigate,
} from 'react-router-dom';

import { OrderStatus } from '../../order/status';
import { IngredientsAndPrice } from './ingredients-and-price';

import { formatOrderDate } from '../../../helpers';
import { Order as OrderType } from '../../../utils/types';

import styles from './index.module.css';

const orderCls = 'order';

const Order: FC<{
  order: OrderType;
  renderStatus?: boolean;
}> = ({ order, renderStatus }) => {
  const navigate = useNavigate();

  return (
    <li
      className = { cs(styles[orderCls], 'p-6 mr-2') }
      onClick = { () => {
        navigate(`/feed/${order._id}`, {
          state: {
            background: true,
          },
        });
      } }>
      <div
        className = { styles[`${orderCls}__number-and-date-wrapper`] }>
        <div
          className = { cs(
            styles[`${orderCls}__number`],
            'text text_type_digits-default',
          ) }>
          #{ order.number }
        </div>
        <div
          className = { cs(
            styles[`${orderCls}__date`],
            'text text_color_inactive',
          ) }>
          { formatOrderDate(order.createdAt) }
        </div>
      </div>
      <div
        className = { cs(
          styles[`${orderCls}__title`],
          'pt-6 text text_type_main-medium',
        ) }>
        { order.name }
      </div>
      { renderStatus ? (
        <>
          <div className = { 'pt-2' } />
          <OrderStatus status = { order.status } />
        </>
      ) : null }
      <div className = { 'pt-6' } />
      <IngredientsAndPrice order = { order } />
    </li>
  );
};

export { Order };
