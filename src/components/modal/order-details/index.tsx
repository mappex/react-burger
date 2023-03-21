import PropTypes from 'prop-types';

import styles from './index.module.css';
import l from '../../../utils/lang';

import {
  orderStatusToStatusTitleMap,
} from '../../../utils/consts';
import { OrderDetails_t } from '../../../utils/types';
import orderAcceptedImage from '../../../images/order_is_accepted.gif';

const OrderDetails = ({
  className,
  orderDetails: { id, status, message },
}: {
  className?: string;
  orderDetails: OrderDetails_t;
}) => (
  <div className = { `${styles['order-details']} ${className}` }>
    <div
      className = { `${styles['order-details__id']} text text_type_digits-large` }>
      { String(id).padStart(6, '0') }
    </div>
    <div className = { 'pt-8' } />
    <div
      className = { `${styles['order-details__id-title']} text text_type_main-medium` }>
      { l('order_id') }
    </div>
    <div className = { 'pt-15' } />
    <div className = { styles['order-details__status-icon-wrapper'] }>
      <img
        src = { `${orderAcceptedImage}?v=${Math.floor(Math.random() * 100)}` }
        height = '120'
        alt = { l('order_is_accepted') }
        title = { l('order_is_accepted') } />
    </div>
    <div className = { 'pt-15' } />
    <div className = { styles['order-details__status-title'] }>
      { orderStatusToStatusTitleMap[status] }
    </div>
    <div className = { 'pt-2' } />
    <div className = { styles['order-details__message'] }>{ message }</div>
  </div>
);

OrderDetails.propTypes = {
  className: PropTypes.string,
  orderDetails: PropTypes.object.isRequired,
};

export { OrderDetails };
