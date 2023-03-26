import cs from 'classnames';

import { TOrderDetails } from '../../utils/types';
import { orderStatusToStatusTitleMap } from '../../utils/consts';

import orderAcceptedImage from '../../images/order_is_accepted.gif';
import styles from './index.module.css';
import l from '../../utils/lang';


const placedOrderDetailsCls = 'placed-order-details';

const PlacedOrderDetails = ({
  className,
  orderDetails: { id, status, message },
}: {
  className?: string;
  orderDetails: TOrderDetails;
}) => (
  <div className = { cs(styles[placedOrderDetailsCls], className) }>
    <div
      className = { cs(
        styles[`${placedOrderDetailsCls}__id`],
        'text text_type_digits-large',
      ) }>
      { String(id).padStart(6, '0') }
    </div>
    <div className = { 'pt-8' } />
    <div
      className = { cs(
        styles[`${placedOrderDetailsCls}__id-title`],
        'text text_type_main-medium',
      ) }>
      { l('order_id') }
    </div>
    <div className = { 'pt-15' } />
    <div className = { styles[`${placedOrderDetailsCls}__status-icon-wrapper`] }>
      <img
        src = { `${orderAcceptedImage}?v=${Math.floor(Math.random() * 100)}` }
        height = '120'
        alt = { l('order_is_accepted') }
        title = { l('order_is_accepted') } />
    </div>
    <div className = { 'pt-15' } />
    <div
      className = {
        styles[`${placedOrderDetailsCls}__status-title`]
      }>
      { orderStatusToStatusTitleMap[status] }
    </div>
    <div className = { 'pt-2' } />
    <div
      className = { cs(
        styles[`${placedOrderDetailsCls}__message`],
        'text_color_inactive',
      ) }>
      { message }
    </div>
  </div>
);

export { PlacedOrderDetails };
