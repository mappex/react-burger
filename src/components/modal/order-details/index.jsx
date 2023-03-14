/* eslint-disable node/no-missing-import */
import PropTypes from 'prop-types';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../../utils/lang';
import orderAcceptedImage from '../../../images/order_is_accepted.gif';

import {
  orderStatusToStatusTitleMap,
} from '../../../utils/consts';

const OrderDetails = ({ className, orderDetails: { id, status, message } }) => (
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

export default OrderDetails;
