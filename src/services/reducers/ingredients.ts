import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidV4 } from 'uuid';

import {
  IngredientType,
  ActualIngredientType,
  TIngredient,
  TActualIngredient,
} from '../../utils/types';

import {
  fetchIngredients as apiFetchIngredients,
} from '../api';

const generateIngredientId = () => uuidV4();

export const initialState: Readonly<{
  actualIngredients: TActualIngredient[];
  idToIngredientMap: { [key: string]: TIngredient };
  idToActualIngredientsCountMap: { [key: string]: number };
  ingredients: TIngredient[];
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

export type TInitialState = typeof initialState;

const buildIdToActualIngredientsCountMap =  ({
  actualIngredients,
}: TInitialState): TInitialState['idToActualIngredientsCountMap'] => actualIngredients
  .reduce((map, actualIngredient) => {
    if (Object.prototype.hasOwnProperty.call(map, actualIngredient.refId)) {
      map[actualIngredient.refId] += 1;
    } else {
      map[actualIngredient.refId] = 1;
    }

    return map;
  }, {} as TInitialState['idToActualIngredientsCountMap']);

export const fetchIngredients = createAsyncThunk('ingredients/fetchIngredients', apiFetchIngredients);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    addIngredient(state, { payload: ingredient }) {
      const { actualIngredients } = state;
      const { _id, type } = ingredient;

      if (type === IngredientType.BUN) {
        const [topBun, bottomBun] = [
          ActualIngredientType.TOP,
          ActualIngredientType.BOTTOM,
        ].map(item => ({
          id: generateIngredientId(),
          type: item,
          isLocked: true,
          refId: _id,
        }));

        state.actualIngredients = [
          topBun,
          ...actualIngredients.slice(1, -1),
          bottomBun,
        ];
      } else if (actualIngredients.length > 0) {
        const newValue = [...actualIngredients];

        newValue.splice(-1, 0, {
          id: generateIngredientId(),
          refId: _id,
        });

        state.actualIngredients = newValue;
      }

      state.idToActualIngredientsCountMap = buildIdToActualIngredientsCountMap(state);
    },
    moveIngredient(state, { payload: [fromIndex, toIndex] }: PayloadAction<[number, number]>) {
      if (fromIndex === toIndex) {
        return;
      }

      if (fromIndex < 1 || toIndex < 1) {
        return;
      }

      const { actualIngredients: actualIngredientsFromState } = state;

      if (fromIndex >= actualIngredientsFromState.length - 1 || toIndex >= actualIngredientsFromState.length - 1) {
        return;
      }

      const actualIngredients = [...actualIngredientsFromState];

      actualIngredients.splice(
        toIndex,
        0,
        actualIngredients.splice(fromIndex, 1)[0],
      );

      state.actualIngredients = actualIngredients;
    },
    removeIngredient(state, { payload: idToRemove }: PayloadAction<TActualIngredient['id']>) {
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
    resetIngredients(state) {
      Object.assign(state, {
        actualIngredients: [],
        idToActualIngredientsCountMap: {},
      });
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
      .addCase(fetchIngredients.fulfilled, (state, { payload: ingredients }: PayloadAction<TIngredient[]>) => {
        const idToIngredientMap: TInitialState['idToIngredientMap'] = {};

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

const { reducer } = ingredientsSlice;

export { reducer as ingredientsReducer };

export const {
  addIngredient,
  moveIngredient,
  removeIngredient,
  resetIngredients,
} = ingredientsSlice.actions;
