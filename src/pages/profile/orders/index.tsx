import { useEffect } from 'react';

import { Feed } from '../../../components/feed';

import {
  subscribeForUserOrders,
  unsubscribeForUserOrders,
} from '../../../services/reducers/orders';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../services/store';
import { getOrders } from '../../../services/selectors';

const OrdersProfile = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(getOrders);

  useEffect(() => {
    dispatch(subscribeForUserOrders());

    return () => {
      dispatch(unsubscribeForUserOrders());
    };
  }, [dispatch]);

  return <Feed orders = { orders } renderStatus = { true } />;
};

export { OrdersProfile };
