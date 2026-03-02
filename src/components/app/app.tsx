import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import { ModalUI } from '@ui';
import { IngredientDetails, OrderInfo, AppHeader } from '@components';
import { Preloader } from '@ui';

import styles from './app.module.css';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUser, setAuthChecked } from '../../services/slices/userSlice';
import { getCookie } from '../../utils/cookie';

const OnlyAuth = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) return <Preloader />;

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

const OnlyUnAuth = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  if (!isAuthChecked) return <Preloader />;

  return !isAuth ? <Outlet /> : <Navigate to={from} replace />;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.ingredients.isLoading);
  const error = useSelector((state) => state.ingredients.error);

  useEffect(() => {
    dispatch(fetchIngredients());

    if (getCookie('accessToken')) {
      dispatch(fetchUser()).finally(() => dispatch(setAuthChecked(true)));
    } else {
      dispatch(setAuthChecked(true));
    }
  }, [dispatch]);

  const handleModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route element={<OnlyUnAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route element={<OnlyAuth />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route path='/profile/orders/:number' element={<OrderInfo />} />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <ModalUI title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </ModalUI>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <ModalUI title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </ModalUI>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ModalUI title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </ModalUI>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
