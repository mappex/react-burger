import { OrderStatus_t } from './types';

import l from './lang';

export const orderStatusToStatusTitleMap: {
  [key in OrderStatus_t]: string;
} = {
  [OrderStatus_t.BEING_COOKED]: l('your_order_has_started'),
  [OrderStatus_t.COOKED]: l('order_prepared'),
  [OrderStatus_t.BEING_DELIVERED]: l('your_order_is_being_delivered'),
  [OrderStatus_t.DELIVERED]: l('order_delivered'),
};
