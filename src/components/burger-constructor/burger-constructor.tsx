import { FC, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BurgerConstructorUI } from '@ui';
import { RootState, AppDispatch } from '../../services/store';
import { fetchOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const constructorItems = useSelector(
    (state: RootState) => state.burgerConstructor
  );

  const { number: orderNumber, isLoading: orderRequest } = useSelector(
    (state: RootState) => state.order
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(fetchOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: any) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // Create a TOrder-like object for the modal
  const orderModalData = orderNumber
    ? {
        _id: '',
        status: 'done',
        name: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        number: orderNumber,
        ingredients: []
      }
    : null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

