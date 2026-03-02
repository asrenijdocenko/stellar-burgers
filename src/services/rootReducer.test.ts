import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('должен вернуть корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        data: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feeds: {
        feed: null,
        currentOrder: null,
        userOrders: [],
        isLoading: false,
        error: null
      },
      user: {
        isAuth: false,
        isAuthChecked: false,
        data: null,
        error: null
      }
    });
  });
});
