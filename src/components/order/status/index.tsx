import { FC } from 'react';
import cs from 'classnames';

import { TOrderStatus } from '../../../utils/types';
import { orderStatusToStatusTitleMap } from '../../../utils/consts';

import styles from './index.module.css';

const orderStatusCls = 'order-status';

const OrderStatus: FC<{ status: TOrderStatus }> = ({ status }) => (
  <div
    className = { cs(styles[orderStatusCls], {
      [styles[`${orderStatusCls}_${TOrderStatus.DONE}`]]:
        status === TOrderStatus.DONE,
    }) }>
    { orderStatusToStatusTitleMap[status] }
  </div>
);

export { OrderStatus };
