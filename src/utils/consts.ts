import { TOrderStatus } from './types';

import l from './lang';

export const orderStatusToStatusTitleMap: {
  [key in TOrderStatus]: string;
} = {
  [TOrderStatus.CREATED]: l('order_created'),
  [TOrderStatus.PENDING]: l('order_pending'),
  [TOrderStatus.DONE]: l('order_done'),
};
