import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearConstructor,
  setCurrentOrder,
  setOrderLoading,
  setOrderNumber
} from '../../services/rootSlice';
import { orderBurgerApi } from '../../utils/burger-api';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector((state) => state.constructor);
  const orderRequest = useSelector((state) => state.orders.isLoading);
  const orderModalData = useSelector((state) => state.orders.currentOrder);
  const isAuth = useSelector((state) => state.user.isAuth);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login');
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(setOrderLoading(true));
    orderBurgerApi(ingredientIds)
      .then((data) => {
        const order = {
          ...data.order,
          ingredients: ingredientIds
        };
        dispatch(setCurrentOrder(order));
        dispatch(clearConstructor());
      })
      .finally(() => {
        dispatch(setOrderLoading(false));
      });
  };

  const closeOrderModal = () => {
    dispatch(setCurrentOrder(null));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

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
