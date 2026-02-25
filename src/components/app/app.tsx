import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  IngredientDetails,
  Login,
  NotFound404,
  OrderDetails,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '../../components/app-header';
import { ProtectedRoute } from '../../components/protected-route';
import { PublicRoute } from '../../components/public-route';
import { Preloader } from '@ui';
import { Route, Routes } from 'react-router-dom';
import { AppDispatch, RootState } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { fetchUser } from '../../services/slices/authSlice';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();

  const isIngredientsLoading = useSelector(
    (state: RootState) => state.ingredients.isLoading
  );
  const ingredientsError = useSelector(
    (state: RootState) => state.ingredients.error
  );
  const authIsLoading = useSelector((state: RootState) => state.auth.isLoading);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  const isLoading = isIngredientsLoading || authIsLoading;

  return (
    <div className={styles.app}>
      {isLoading && <Preloader />}
      {!isLoading && (
        <>
          <AppHeader />
          {ingredientsError && (
            <div className={`${styles.error} text text_type_main-medium pt-4`}>
              {ingredientsError}
            </div>
          )}
          <Routes>
            <Route path='/' element={<ConstructorPage />}>
              <Route path='ingredients/:id' element={<IngredientDetails />} />
            </Route>
            <Route path='/feed' element={<Feed />}>
              <Route path=':id' element={<OrderDetails />} />
            </Route>
            <Route
              path='/login'
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path='/register'
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            >
              <Route path=':id' element={<OrderDetails />} />
            </Route>
            <Route path='*' element={<NotFound404 />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
