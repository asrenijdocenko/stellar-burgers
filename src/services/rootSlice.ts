import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  logoutApi
} from '../utils/burger-api';
import {
  TIngredient,
  TConstructorIngredient,
  TOrder,
  TUser,
  TOrdersData
} from '../utils/types';
import { v4 as uuidv4 } from 'uuid';

import { getOrdersApi } from '../utils/burger-api';
import { deleteCookie } from '../utils/cookie';

export const fetchUserOrders = createAsyncThunk(
  'root/fetchUserOrders',
  async () => await getOrdersApi()
);

export const fetchIngredients = createAsyncThunk(
  'root/fetchIngredients',
  async () => await getIngredientsApi()
);

export const fetchFeeds = createAsyncThunk(
  'root/fetchFeeds',
  async () => await getFeedsApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'root/fetchOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

export const logoutUser = createAsyncThunk('root/logoutUser', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});

interface RootStateType {
  ingredients: {
    data: TIngredient[];
    isLoading: boolean;
    error: string | null;
  };
  constructor: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orders: {
    feed: TOrdersData | null;
    currentOrder: TOrder | null;
    orderNumber: number | null;
    userOrders: TOrder[];
    isLoading: boolean;
    error: string | null;
  };
  user: {
    isAuth: boolean;
    data: TUser | null;
    isAuthChecked: boolean;
  };
}

const initialState: RootStateType = {
  ingredients: {
    data: [],
    isLoading: false,
    error: null
  },
  constructor: {
    bun: null,
    ingredients: []
  },
  orders: {
    feed: null,
    currentOrder: null,
    orderNumber: null,
    userOrders: [],
    isLoading: false,
    error: null
  },
  user: {
    isAuth: false,
    isAuthChecked: false,
    data: null
  }
};

const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setAuthChecked(state, action: PayloadAction<boolean>) {
      state.user.isAuthChecked = action.payload;
    },
    setOrderNumber(state, action: PayloadAction<number | null>) {
      state.orders.orderNumber = action.payload;
    },
    setFeed(state, action: PayloadAction<TOrdersData>) {
      state.orders.feed = action.payload;
    },
    setBun(state, action: PayloadAction<TIngredient>) {
      state.constructor.bun = action.payload;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      const ingredientWithId: TConstructorIngredient = {
        ...action.payload,
        id: uuidv4()
      };
      state.constructor.ingredients.push(ingredientWithId);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.constructor.ingredients = state.constructor.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient(
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.constructor.ingredients];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      state.constructor.ingredients = items;
    },
    clearConstructor(state) {
      state.constructor.bun = null;
      state.constructor.ingredients = [];
    },
    setAuth(state, action: PayloadAction<boolean>) {
      state.user.isAuth = action.payload;
    },
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user.data = action.payload;
    },
    setCurrentOrder(state, action: PayloadAction<TOrder | null>) {
      state.orders.currentOrder = action.payload;
    },
    setOrderLoading(state, action: PayloadAction<boolean>) {
      state.orders.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orders.userOrders = action.payload;
      })
      .addCase(fetchIngredients.pending, (state) => {
        state.ingredients.isLoading = true;
        state.ingredients.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients.isLoading = false;
        state.ingredients.data = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.ingredients.isLoading = false;
        state.ingredients.error = action.error.message || 'Ошибка загрузки';
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.orders.isLoading = true;
        state.orders.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orders.isLoading = false;
        state.orders.feed = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.orders.isLoading = false;
        state.orders.error = action.error.message || 'Ошибка загрузки';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orders.currentOrder = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user.isAuth = false;
        state.user.data = null;
      });
  }
});

export const {
  setFeed,
  setOrderNumber,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  setAuth,
  setUser,
  setCurrentOrder,
  setOrderLoading,
  setAuthChecked
} = rootSlice.actions;

export default rootSlice.reducer;
