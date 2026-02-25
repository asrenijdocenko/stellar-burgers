import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

interface FeedsState {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
}

export const fetchFeeds = createAsyncThunk('feeds/fetch', async () => {
  const data = await getFeedsApi();
  return data;
});

export const fetchUserOrders = createAsyncThunk(
  'feeds/fetchUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState: {
    orders: [],
    isLoading: false,
    error: null
  } as FeedsState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch feeds';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });
  }
});

export default feedsSlice.reducer;
