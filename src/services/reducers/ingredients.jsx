/* eslint-disable no-param-reassign */
import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import {
  IngredientType,
  ActualIngredientType,
} from '../../utils/types';

import {
  fetchIngredients as apiFetchIngredients,
} from '../api';

const initialState = {
  actualIngredients: [],
  detailedIngredient: null,
  idToActualIngredientsCountMap: {},
  idToIngredientMap: {},
  ingredients: [],
  ingredientsError: null,
  ingredientsRequest: false,
};

const buildIdToActualIngredientsCountMap = ({ actualIngredients }) => actualIngredients
  .reduce((map, actualIngredient) => {
    if (Object.prototype.hasOwnProperty.call(map, actualIngredient.refId)) {
      map[actualIngredient.refId] += 1;
    } else {
      map[actualIngredient.refId] = 1;
    }

    return map;
  }, {});

export const fetchIngredients = createAsyncThunk('main/fetchIngredients', apiFetchIngredients);

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
        // eslint-disable-next-line @typescript-eslint/no-shadow
        ].map(type => ({
          id,
          type,
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
    moveIngredient(state, { payload: [fromIndex, toIndex] }) {
      const { actualIngredients: actualIngredientsFromState } = state;
      const actualIngredients = [...actualIngredientsFromState];

      actualIngredients.splice(
        toIndex,
        0,
        actualIngredients.splice(fromIndex, 1)[0],
      );

      state.actualIngredients = actualIngredients;
    },
    removeIngredient(state, { payload: idToRemove }) {
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
    resetDetailedIngredient(state) {
      state.detailedIngredient = null;
    },
    resetOrderDetails(state) {
      if (!state.orderDetailsRequest) {
        Object.assign(state, {
          orderDetails: null,
          orderDetailsError: null,
          orderDetailsRequest: false,
        });
      }
    },
    setDetailedIngredient(state, action) {
      state.detailedIngredient = action.payload;
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
      .addCase(fetchIngredients.fulfilled, (state, { payload: ingredients }) => {
        const idToIngredientMap = {};

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
  resetDetailedIngredient,
  setDetailedIngredient,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
