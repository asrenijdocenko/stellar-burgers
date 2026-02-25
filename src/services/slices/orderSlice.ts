import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';

interface OrderState {
  number: number | null;
  isLoading: boolean;
  error: string | null;
}

export const fetchOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    number: null,
    isLoading: false,
    error: null
  } as OrderState,
  reducers: {
    clearOrder: (state) => {
      state.number = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.number = action.payload.order.number;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create order';
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
