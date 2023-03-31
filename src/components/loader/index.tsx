import React, { FC } from 'react';

import styles from './index.module.css';
import loading from '../../images/loading.gif';
import l from '../../utils/lang';

interface IProps {
  extraClass?: string;
}

const Loader: FC<IProps> = ({ extraClass = '' }) => {
  return (
    <div className = { `${styles.loader} ${extraClass}` }>
      <img src = { loading } alt = { l('loading') + '...' } />
    </div>
  );
};

export default React.memo(Loader);
