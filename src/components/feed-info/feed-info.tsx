import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { feedOrders, feedTotal, feedTotalToday } = useSelector(
    (state) => state.order
  );

  const readyOrders = getOrders(feedOrders, 'done');
  const pendingOrders = getOrders(feedOrders, 'pending');

  const feed = {
    total: feedTotal,
    totalToday: feedTotalToday
  };

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
