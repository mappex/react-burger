import PropTypes from 'prop-types';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';

const Amount = ({ amount, className, isTotal }) => {
  let style = `${styles.amount} text`;

  if (isTotal) {
    style += ' text_type_digits-medium';
  } else {
    style += ' text_type_digits-default';
  }
  style += ` ${className}`;

  return (
    <div
      className = { style }>
      <div className = { styles.amount__amount }>{ amount }</div>
      <div className = { styles['amount__currency-wrapper'] }>
        <CurrencyIcon type = { 'primary' } />
      </div>
    </div>
  );
};

Amount.propTypes = {
  amount: PropTypes.number.isRequired,
  className: PropTypes.string,
  isTotal: PropTypes.bool,
};

export default Amount;
