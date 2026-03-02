import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
import { TOrder, TOrdersData } from '../../utils/types';

interface FeedsState {
  feed: TOrdersData | null;
  currentOrder: TOrder | null;
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

export const fetchFeeds = createAsyncThunk(
  'feeds/fetch',
  async () => await getFeedsApi()
);

export const fetchUserOrders = createAsyncThunk(
  'feeds/fetchUserOrders',
  async () => await getOrdersApi()
);

export const fetchOrderByNumber = createAsyncThunk(
  'feeds/fetchOrderByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState: {
    feed: null,
    currentOrder: null,
    userOrders: [],
    isLoading: false,
    error: null
  } as FeedsState,
  reducers: {
    setCurrentOrder(state, action: PayloadAction<TOrder | null>) {
      state.currentOrder = action.payload;
    },
    setOrderLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      });
  }
});

export const { setCurrentOrder, setOrderLoading } = feedsSlice.actions;
export default feedsSlice.reducer;
