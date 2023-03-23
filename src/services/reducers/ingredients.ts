import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  IngredientType,
  ActualIngredientType,
  Ingredient_t,
  ActualIngredient_t,
} from '../../utils/types';

import {
  fetchIngredients as apiFetchIngredients,
} from '../api';

const initialState: Readonly<{
  actualIngredients: ActualIngredient_t[];
  idToIngredientMap: { [key: string]: Ingredient_t };
  idToActualIngredientsCountMap: { [key: string]: number };
  ingredients: Ingredient_t[];
  ingredientsError: unknown | null;
  ingredientsRequest: boolean;
}> = {
  actualIngredients: [],
  idToActualIngredientsCountMap: {},
  idToIngredientMap: {},
  ingredients: [],
  ingredientsError: null,
  ingredientsRequest: true,
};

type InitialState_t = typeof initialState;

const buildIdToActualIngredientsCountMap =  ({
  actualIngredients,
}: InitialState_t): InitialState_t['idToActualIngredientsCountMap'] => actualIngredients
  .reduce((map, actualIngredient) => {
    if (Object.prototype.hasOwnProperty.call(map, actualIngredient.refId)) {
      map[actualIngredient.refId] += 1;
    } else {
      map[actualIngredient.refId] = 1;
    }

    return map;
  }, {} as InitialState_t['idToActualIngredientsCountMap']);

export const fetchIngredients = createAsyncThunk('ingredients/fetchIngredients', apiFetchIngredients);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient(state, { payload: { id, ingredient } }) {
      const { actualIngredients } = state;
      const { _id, type } = ingredient;

      if (type === IngredientType.BUN) {
        const [topBun, bottomBun] = [
          ActualIngredientType.TOP,
          ActualIngredientType.BOTTOM,
        ].map(item => ({
          id,
          type: item,
          isLocked: true,
          refId: _id,
        }));

        state.actualIngredients = [
          topBun,
          ...actualIngredients.slice(1, -1),
          bottomBun,
        ];
      } else {
        const newValue = [...actualIngredients];

        newValue.splice(-1, 0, {
          id,
          refId: _id,
        });

        state.actualIngredients = newValue;
      }

      state.idToActualIngredientsCountMap = buildIdToActualIngredientsCountMap(state);
    },
    moveIngredient(state, { payload: [fromIndex, toIndex] }: PayloadAction<[number, number]>) {
      const { actualIngredients: actualIngredientsFromState } = state;
      const actualIngredients = [...actualIngredientsFromState];

      actualIngredients.splice(
        toIndex,
        0,
        actualIngredients.splice(fromIndex, 1)[0],
      );

      state.actualIngredients = actualIngredients;
    },
    removeIngredient(state, { payload: idToRemove }: PayloadAction<ActualIngredient_t['id']>) {
      const { actualIngredients } = state;
      const removableIngredients = state.actualIngredients.slice(1, -1);

      if (removableIngredients.map(({ id }) => id).includes(idToRemove)) {
        state.actualIngredients = [
          actualIngredients[0],
          ...removableIngredients.filter(({ id }) => id !== idToRemove),
          actualIngredients[actualIngredients.length - 1],
        ];
        state.idToActualIngredientsCountMap = buildIdToActualIngredientsCountMap(state);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        Object.assign(state, {
          ...initialState,
          ingredientsRequest: true,
        });
      })
      .addCase(fetchIngredients.fulfilled, (state, { payload: ingredients }: PayloadAction<Ingredient_t[]>) => {
        const idToIngredientMap: InitialState_t['idToIngredientMap'] = {};

        ingredients.forEach((ingredient) => {
          idToIngredientMap[ingredient._id] = ingredient;
        });

        Object.assign(state, {
          idToIngredientMap,
          ingredients,
          ingredientsRequest: false,
        });
      })
      .addCase(fetchIngredients.rejected, (state, { error }) => {
        Object.assign(state, {
          ingredientsError: error,
          ingredientsRequest: false,
        });
      });
  },
});

export const {
  addIngredient,
  moveIngredient,
  removeIngredient,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
