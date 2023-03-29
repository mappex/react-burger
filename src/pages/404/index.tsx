import { FC } from 'react';

import styles from '../index.module.css';
import l from '../../utils/lang';

const NotFoundPage: FC = () => (
  <div className = { `${styles.page} 404` }>
    { l('not_found_page') }
  </div>
);

export { NotFoundPage };
