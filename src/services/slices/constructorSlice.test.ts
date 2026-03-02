import reducer, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '../../utils/types';

const mockBun: TIngredient = {
  _id: 'bun-1',
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
};

const mockIngredient: TIngredient = {
  _id: 'ing-1',
  name: 'Говяжий метеорит',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('burgerConstructor reducer', () => {
  describe('setBun', () => {
    it('должен установить булку в конструктор', () => {
      const state = reducer(initialState, setBun(mockBun));
      expect(state.bun).toEqual(mockBun);
    });

    it('должен заменить булку на новую', () => {
      const stateWithBun = { bun: mockBun, ingredients: [] };
      const newBun = { ...mockBun, _id: 'bun-2', name: 'Флюоресцентная булка' };
      const state = reducer(stateWithBun, setBun(newBun));
      expect(state.bun).toEqual(newBun);
    });
  });

  describe('addIngredient', () => {
    it('должен добавить ингредиент в список и присвоить ему уникальный id', () => {
      const state = reducer(initialState, addIngredient(mockIngredient));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe(mockIngredient._id);
      expect(state.ingredients[0].id).toBeDefined();
    });

    it('должен добавить несколько ингредиентов', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      state = reducer(state, addIngredient(mockIngredient));
      expect(state.ingredients).toHaveLength(2);
    });

    it('одинаковые ингредиенты должны иметь разные id', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      state = reducer(state, addIngredient(mockIngredient));
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по id', () => {
      const stateWithIngredient = reducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const { id } = stateWithIngredient.ingredients[0];
      const state = reducer(stateWithIngredient, removeIngredient(id));
      expect(state.ingredients).toHaveLength(0);
    });

    it('не должен удалять ингредиент с несуществующим id', () => {
      const stateWithIngredient = reducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const state = reducer(
        stateWithIngredient,
        removeIngredient('non-existent-id')
      );
      expect(state.ingredients).toHaveLength(1);
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент с позиции 0 на позицию 1', () => {
      const mockIngredient2 = {
        ...mockIngredient,
        _id: 'ing-2',
        name: 'Соус Spicy'
      };
      let state = reducer(initialState, addIngredient(mockIngredient));
      state = reducer(state, addIngredient(mockIngredient2));

      const firstId = state.ingredients[0].id;
      const secondId = state.ingredients[1].id;

      state = reducer(state, moveIngredient({ fromIndex: 0, toIndex: 1 }));

      expect(state.ingredients[0].id).toBe(secondId);
      expect(state.ingredients[1].id).toBe(firstId);
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = reducer(initialState, setBun(mockBun));
      state = reducer(state, addIngredient(mockIngredient));

      state = reducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
