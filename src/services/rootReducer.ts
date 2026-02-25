import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import authReducer from './slices/authSlice';
import orderReducer from './slices/orderSlice';
import feedsReducer from './slices/feedsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  auth: authReducer,
  order: orderReducer,
  feeds: feedsReducer
});
