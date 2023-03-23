import styles from '../index.module.css';
import l from '../../../utils/lang';

const Orders = () => (
  <div className = { `${styles.page} 404` }>
    { l('history_of_orders') }
  </div>
);

export { Orders };
