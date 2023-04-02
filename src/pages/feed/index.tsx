import { FC } from 'react';
import cs from 'classnames';

import { FeedActivity } from '../../components/feed/activity';
import { Feed as FeedComponent } from '../../components/feed';

import { useAppSelector } from '../../services/store';
import { getOrders } from '../../services/selectors';

import styles from './index.module.css';
import l from '../../utils/lang';

const FeedPageCls = 'feed-page';

const FeedPage: FC = () => {
  const { orders, total, totalToday } = useAppSelector(getOrders);

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className = { styles[FeedPageCls] }>
      <div
        className = { cs(
          styles[`${FeedPageCls}__feed-wrapper`],
          'pt-10  pb-5',
        ) }>
        <div
          className = { cs(
            styles[`${FeedPageCls}__title`],
            'text text_type_main-large  pb-5',
          ) }>
          { l('order_feed') }
        </div>
        <FeedComponent
          className = { styles[`${FeedPageCls}__feed`] }
          orders = { orders } />
      </div>
      <div
        className = { cs(styles[`${FeedPageCls}__space`], 'pl-15') } />
      <div
        className = { cs(
          styles[`${FeedPageCls}__activity`],
          'pt-25 pb-5 text',
        ) }>
        <FeedActivity
          orders = { orders }
          total = { total }
          totalToday = { totalToday } />
      </div>
    </div>
  );
};

export { FeedPage };
