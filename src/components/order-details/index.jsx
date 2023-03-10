import PropTypes from 'prop-types';

import styles from './index.module.css';
import l from '../../utils/lang';
import orderAcceptedImage from '../../images/order_is_accepted.gif';

function OrderDetails({ orderData }) {
  return (
    <div className = { `${styles.order_details_container} mt-20 mb-15` }>
      { orderData.success ? (
        <>
          <p className = { `${styles.order_id} text text_type_digits-large` }>
            { orderData.id }
          </p>
          <p className = 'text text_type_main-medium mt-8 mb-15'>
            { l('order_id') }
          </p>
          <img
            src = { `${orderAcceptedImage}?v=${Math.floor(Math.random() * 100)}` }
            height = '120'
            alt = { l('order_is_accepted') }
            title = { l('order_is_accepted') } />
          <p className = 'text text_type_main-default mt-15 mb-2'>
            { l('your_order_has_started') }
          </p>
          <p className = 'text text_type_main-default text_color_inactive'>
            { l('order_details_wait_readiness') }
          </p>
        </>
      ) : (
        <>
          <p className = 'text text_type_main-large'>
              Произошла ошибка
          </p>
          <p className = 'text text_type_main-default text_color_inactive mt-8 mb-15'>
              Пожалуйста, попробуйте оформить заказ позже
          </p>
        </>
      )
      }
    </div>
  );
}

OrderDetails.propTypes = {
  orderData: PropTypes.shape({
    id: PropTypes.number,
    success: PropTypes.bool.isRequired,
  }).isRequired,
};

export default OrderDetails;
