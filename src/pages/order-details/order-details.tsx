import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OrderDetailsUI, ModalUI } from '@ui';
import { RootState } from '../../services/store';

export const OrderDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const allOrders = useSelector((state: RootState) => state.feeds.orders);

  const order = allOrders.find((item) => item.number === Number(id));

  const handleClose = () => {
    navigate(-1);
  };

  if (!order) {
    return null;
  }

  return (
    <ModalUI title='Детали заказа' onClose={handleClose}>
      <OrderDetailsUI orderNumber={order.number} />
    </ModalUI>
  );
};
