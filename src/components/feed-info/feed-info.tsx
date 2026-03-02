import { FC } from 'react';
import { TOrder, TOrdersData } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

const defaultFeed: TOrdersData = {
  orders: [],
  total: 0,
  totalToday: 0
};

export const FeedInfo: FC = () => {
  const feed: TOrdersData = useSelector(
    (state) => state.feeds.feed ?? defaultFeed
  );
  const orders = feed.orders;

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
