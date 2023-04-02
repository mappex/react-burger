import React, {
  ReactNode,
  useMemo,
  FC } from 'react';
import cs from 'classnames';

import {
  Order,
  TOrderStatus,
} from '../../../utils/types';
import { orderStatusToStatusTitleMap } from '../../../utils/consts';

import styles from './index.module.css';
import l from '../../../utils/lang';

const feedActivityCls = 'feed-activity';

const FeedActivity: FC<{
  className?: string;
  orders: Order[];
  total?: number;
  totalToday?: number;
}> = ({ className, orders, total, totalToday }) => {
  const statusToOrdersMap = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        const { status } = order;

        if (!result.hasOwnProperty(status)) {
          result[status] = [];
        }

        result[status].push(order);

        return result;
      },
      {} as {
        [key in TOrderStatus]: Order[];
      },
    );
  }, [orders]);

  const statusToStatusUlsMap = [
    TOrderStatus.CREATED,
    TOrderStatus.PENDING,
    TOrderStatus.DONE,
  ].reduce((result, status) => {
    const items = statusToOrdersMap[status];

    // eslint-disable-next-line react-hooks/rules-of-hooks
    result[status] = useMemo(() => {
      return items ? [items.slice(0, 5), items.slice(5, 10)].map((orderList, ix) => {
        return orderList.length > 0 ? (
          <React.Fragment key = { ix }>
            <ul
              key = { ix }
              className = { cs(
                styles[`${feedActivityCls}__orders`],
                'text text_type_digits-default',
              ) }>
              { orderList.map(({ _id: id, number }, idx) => (
                <React.Fragment key = { id }>
                  { idx > 0 ? <div className = { 'pt-2' } /> : null }
                  <li
                    className = { cs(
                      styles[`${feedActivityCls}__order`],
                    ) }>
                    { number }
                  </li>
                </React.Fragment>
              )) }
            </ul>
          </React.Fragment>
        ) : null;
      }) : null;
    }, [items]);

    return result;
  }, {} as { [key in TOrderStatus]: ReactNode });

  return (
    <div
      className = { cs(
        styles[feedActivityCls],
        'custom-scroll',
        className,
      ) }>
      <div className = { styles[`${feedActivityCls}__orders-by-status`] }>
        { [TOrderStatus.DONE, TOrderStatus.PENDING].map((status, ix) => (
          <React.Fragment key = { status }>
            { ix > 0 ? <div className = { 'pb-6' } /> : null }
            <div
              className = { cs(
                styles[`${feedActivityCls}__orders-list`],
                styles[
                  `${feedActivityCls}__orders-list_${status}`
                ],
              ) }>
              <div className = { 'pb-6' }>
                { orderStatusToStatusTitleMap[status] }:
              </div>
              <div className = { styles[`${feedActivityCls}__orders-wrapper`] }>
                { statusToStatusUlsMap[status] }
              </div>
            </div>
          </React.Fragment>
        )) }
      </div>
      { total ? (
        <>
          <div className = { 'pt-15' } />
          <div className = { 'text text_type_main-medium' }>
            { l('order_total_count') }:
          </div>
          <div
            className = { cs(
              styles[
                `${feedActivityCls}__orders-total-count`
              ],
              'text text_type_digits-large',
            ) }>
            { total }
          </div>
        </>
      ) : null }
      { totalToday ? (
        <>
          <div className = { 'pt-15' } />
          <div className = { 'text text_type_main-medium' }>
            { l('order_today_total_count') }:
          </div>
          <div
            className = { cs(
              styles[
                `${feedActivityCls}__orders-total-count`
              ],
              'text text_type_digits-large',
            ) }>
            { totalToday }
          </div>
        </>
      ) : null }
    </div>
  );
};

export { FeedActivity };
