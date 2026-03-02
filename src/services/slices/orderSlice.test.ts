import reducer, { fetchOrder, clearOrder } from './orderSlice';

const initialState = {
  number: null,
  isLoading: false,
  error: null
};

describe('order reducer', () => {
  describe('fetchOrder.pending (Request)', () => {
    it('должен установить isLoading в true и сбросить ошибку', () => {
      const action = { type: fetchOrder.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchOrder.fulfilled (Success)', () => {
    it('должен записать номер заказа и установить isLoading в false', () => {
      const action = {
        type: fetchOrder.fulfilled.type,
        payload: { order: { number: 12345 } }
      };
      const state = reducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.number).toBe(12345);
    });
  });

  describe('fetchOrder.rejected (Failed)', () => {
    it('должен записать ошибку и установить isLoading в false', () => {
      const action = {
        type: fetchOrder.rejected.type,
        error: { message: 'Failed to create order' }
      };
      const state = reducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Failed to create order');
    });
  });

  describe('clearOrder', () => {
    it('должен сбросить номер заказа', () => {
      const stateWithOrder = { number: 12345, isLoading: false, error: null };
      const state = reducer(stateWithOrder, clearOrder());

      expect(state.number).toBeNull();
    });
  });
});
