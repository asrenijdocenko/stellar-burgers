import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/rootSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.orders.feed);
  const isLoading = useSelector((state) => state.orders.isLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading || !feed) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feed.orders}
      handleGetFeeds={() => dispatch(fetchFeeds())}
    />
  );
};
