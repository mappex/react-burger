import { OrderStatus } from './types';

import l from './lang';

export const orderStatusToStatusTitleMap = {
  [OrderStatus.BEING_COOKED]: l('your_order_has_started'),
  [OrderStatus.COOKED]: l('order_prepared'),
  [OrderStatus.BEING_DELIVERED]: l('your_order_is_being_delivered'),
  [OrderStatus.DELIVERED]: l('order_delivered'),
};
