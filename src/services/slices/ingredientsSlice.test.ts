import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  }
];

const initialState = {
  data: [],
  isLoading: false,
  error: null
};

describe('ingredients reducer', () => {
  describe('fetchIngredients.pending (Request)', () => {
    it('должен установить isLoading в true и сбросить ошибку', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled (Success)', () => {
    it('должен записать ингредиенты и установить isLoading в false', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = reducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.data).toEqual(mockIngredients);
    });
  });

  describe('fetchIngredients.rejected (Failed)', () => {
    it('должен записать ошибку и установить isLoading в false', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка загрузки ингредиентов' }
      };
      const state = reducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });

    it('должен установить дефолтное сообщение если ошибка не передана', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = reducer(initialState, action);

      expect(state.error).toBe('Ошибка загрузки');
    });
  });
});
