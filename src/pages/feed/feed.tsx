import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState, AppDispatch } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.feeds.orders);
  const isLoading = useSelector((state: RootState) => state.feeds.isLoading);
  const error = useSelector((state: RootState) => state.feeds.error);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='text text_type_main-medium pt-4'>
        Ошибка загрузки: {error}
      </div>
    );
  }

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchFeeds())} />
      <Outlet />
    </>
  );
};
