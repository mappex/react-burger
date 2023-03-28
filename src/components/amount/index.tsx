import cs from 'classnames';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';

const Amount = ({
  amount,
  className,
  isTotal,
}: {
  amount: number;
  className?: string;
  isTotal?: boolean;
}) => {
  return (
    <div
      className = { cs(
        styles.amount,
        'text',
        {
          [styles.amount_type_total]: isTotal,
          'text_type_digits-default': !isTotal,
          'text_type_digits-medium': isTotal,
        },
        className,
      ) }>
      <div className = { styles.amount__amount }>{ amount }</div>
      <div className = { styles['amount__currency-wrapper'] }>
        <CurrencyIcon type = { 'primary' } />
      </div>
    </div>
  );
};

export { Amount };
