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
import { fetchIngredients, setAuth, setUser } from '../../services/rootSlice';
import { getUserApi } from '../../utils/burger-api';
import { getCookie } from '../../utils/cookie';

const OnlyAuth = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  return isAuth ? <Outlet /> : <Navigate to='/login' replace />;
};

const OnlyUnAuth = () => {
  const isAuth = useSelector((state) => state.user.isAuth);
  return !isAuth ? <Outlet /> : <Navigate to='/' replace />;
};

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());

    if (getCookie('accessToken')) {
      getUserApi()
        .then((data) => {
          dispatch(setAuth(true));
          dispatch(setUser(data.user));
        })
        .catch(() => {
          dispatch(setAuth(false));
          dispatch(setUser(null));
        });
    }
  }, [dispatch]);

  const handleModalClose = () => navigate(-1);

  return (
    <div className={styles.app}>
      <AppHeader />

      {isLoading && <Preloader />}
      {error && <div className='text text_type_main-medium'>{error}</div>}

      {!isLoading && !error && (
        <>
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
                  <ModalUI
                    title='Детали ингредиента'
                    onClose={handleModalClose}
                  >
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
        </>
      )}
    </div>
  );
};

export default App;
