import React, { FC } from 'react';
import cs from 'classnames';

import { Order } from '../../utils/types';
import { Order as OrderComponent } from './order';
import styles from './index.module.css';

const Feed: FC<{
  className?: string;
  orders: Order[];
  renderStatus?: boolean;
}> = ({ className, orders, renderStatus }) => {
  return (
    <ul className = { cs(styles.feed, 'custom-scroll', className) }>
      { orders.map((order, ix) => (
        <React.Fragment key = { order._id }>
          <OrderComponent order = { order } renderStatus = { renderStatus } />
          { ix + 1 < orders.length ? <div className = { 'pt-4' } /> : null }
        </React.Fragment>
      )) }
    </ul>
  );
};

Feed.defaultProps = {
  renderStatus: false,
};

export { Feed };
