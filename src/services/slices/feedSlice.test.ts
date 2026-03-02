import reducer, { fetchFeeds } from './feedsSlice';

const initialState = {
  feed: null,
  currentOrder: null,
  userOrders: [],
  isLoading: false,
  error: null
};

const mockFeed = {
  orders: [],
  total: 100,
  totalToday: 5
};

describe('feeds reducer', () => {
  describe('fetchFeeds.pending (Request)', () => {
    it('должен установить isLoading в true и сбросить ошибку', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchFeeds.fulfilled (Success)', () => {
    it('должен записать ленту заказов и установить isLoading в false', () => {
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeed
      };
      const state = reducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.feed).toEqual(mockFeed);
    });
  });

  describe('fetchFeeds.rejected (Failed)', () => {
    it('должен записать ошибку и установить isLoading в false', () => {
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: 'Ошибка загрузки ленты' }
      };
      const state = reducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ленты');
    });
  });
});
