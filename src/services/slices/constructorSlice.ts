import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';

interface ConstructorState {
  bun: TIngredient | null;
  ingredients: TIngredient[];
}

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: {
    bun: null,
    ingredients: []
  } as ConstructorState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item._id !== action.payload
      );
    },
    setBun: (state, action: PayloadAction<TIngredient | null>) => {
      state.bun = action.payload;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const { addIngredient, removeIngredient, setBun, clearConstructor } =
  constructorSlice.actions;

export default constructorSlice.reducer;
