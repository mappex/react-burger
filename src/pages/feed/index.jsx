import styles from '../index.module.css';
import l from '../../utils/lang';

const FeedPage = () => (
  <div className = { `${styles.page} feed` }>
    { l('order_feed') }
  </div>
);

export { FeedPage };
