import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { RootState, AppDispatch } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/feedsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((state: RootState) => state.feeds.orders);
  const isLoading = useSelector((state: RootState) => state.feeds.isLoading);
  const error = useSelector((state: RootState) => state.feeds.error);

  useEffect(() => {
    dispatch(fetchUserOrders());
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
      <ProfileOrdersUI orders={orders} />
      <Outlet />
    </>
  );
};
