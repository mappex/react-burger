/* eslint-disable no-extra-parens */
import { v4 } from 'uuid';

import { IngredientType } from '../../utils/types';
import * as apiModule from '../api';
import {
  initialState,
  addIngredient,
  ingredientsReducer,
  fetchIngredients,
  TInitialState,
  moveIngredient,
  removeIngredient,
} from './ingredients';


jest.mock('../api', () => ({
  fetchIngredients: jest.fn(),
}));
jest.mock('uuid');

const aBun = Object.freeze({
  _id: '60d3b41abdacab0026a733c6',
  name: 'Краторная булка N-200i',
  type: IngredientType.BUN,
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
});

const anotherBun = Object.freeze({
  _id: '60d3b41abdacab0026a733c7',
  name: 'Флюоресцентная булка R2-D3',
  type: IngredientType.BUN,
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  __v: 0,
});

const aSauce = Object.freeze({
  _id: '60d3b41abdacab0026a733cc',
  name: 'Соус Spicy-X',
  type: IngredientType.SAUCE,
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  __v: 0,
});

describe('burger reducer', () => {
  afterAll(() => {
    jest.unmock('uuid');
    jest.unmock('../api');
  });

  it('has initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'some action' })).toEqual(
      initialState,
    );
  });

  describe('fetchIngredients', () => {
    it('updates state with fetchIngredients result (pending)', () => {
      const state = ingredientsReducer(initialState, {
        type: 'ingredients/fetchIngredients/pending',
      });

      expect(state.ingredientsRequest).toEqual(true);
    });

    it('updates state with placeAnOrder result (rejected)', () => {
      const error = Symbol('error');
      const state = ingredientsReducer(initialState, {
        type: 'ingredients/fetchIngredients/rejected',
        error,
      });

      expect(state.ingredientsRequest).toEqual(false);
      expect(state.ingredientsError).toEqual(error);
    });

    it('correctly calls fetchIngredients', async () => {
      const action = fetchIngredients();
      const dispatch = jest.fn();
      const getState = jest.fn();

      await action(dispatch, getState, undefined);

      expect(dispatch.mock.calls.map(([{ type }]) => type)).toEqual([
        'ingredients/fetchIngredients/pending',
        'ingredients/fetchIngredients/fulfilled',
      ]);
      expect(apiModule.fetchIngredients).toHaveBeenCalledTimes(1);
    });
  });

  describe('burger constructor', () => {
    const fetchedIngredients = [aBun, anotherBun, aSauce];
    let state: TInitialState;

    beforeEach(async () => {
      (apiModule.fetchIngredients as jest.Mock).mockResolvedValueOnce(fetchedIngredients);

      state = JSON.parse(JSON.stringify(initialState));

      const actionApi = fetchIngredients();
      const dispatch = jest.fn((action) => {
        state = ingredientsReducer(state, action);
      });
      const getState = jest.fn();

      await actionApi(dispatch, getState, undefined);

      let i = 1;

      // eslint-disable-next-line no-plusplus
      (v4 as jest.Mock).mockImplementation(() => String(i++));
    });

    it('simulate fetching', () => {
      expect(apiModule.fetchIngredients).toHaveBeenCalledTimes(1);
      expect(state.ingredients).toEqual(fetchedIngredients);
      expect(Object.keys(state.idToIngredientMap)).toEqual(
        fetchedIngredients.map(({ _id: id }) => id),
      );
      expect(Object.values(state.idToIngredientMap)).toEqual(
        fetchedIngredients,
      );
    });

    it('handles addIngredient action (a bun)',  () => {
      state = ingredientsReducer(state, addIngredient(aBun));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);
    });

    it('handles addIngredient action (a bun) twice',  () => {
      state = ingredientsReducer(state, addIngredient(aBun));
      state = ingredientsReducer(state, addIngredient(anotherBun));

      expect(state.actualIngredients).toEqual([
        { id: '3', isLocked: true, refId: anotherBun._id, type: 'top' },
        { id: '4', isLocked: true, refId: anotherBun._id, type: 'bottom' },
      ]);
    });

    it('handles removeIngredient (a bun)',  () => {
      state = ingredientsReducer(state, addIngredient(aBun));
      state = ingredientsReducer(state, removeIngredient(aBun._id));

      expect(state.actualIngredients.length).toEqual(2);
    });

    it('handles addIngredient action (not a bun, without a bun)',  () => {
      state = ingredientsReducer(state, addIngredient(aSauce));

      expect(state.actualIngredients).toEqual([]);
    });

    it('handles addIngredient action (not a bun, with a bun)',  () => {
      state = ingredientsReducer(state, addIngredient(aBun));
      state = ingredientsReducer(state, addIngredient(aSauce));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);
    });

    it('handles moveIngredient action', () => {
      state = ingredientsReducer(state, addIngredient(aBun));
      state = ingredientsReducer(state, addIngredient(aSauce));
      state = ingredientsReducer(state, addIngredient(aSauce));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '4', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, moveIngredient([1, 2]));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '4', refId: aSauce._id },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, moveIngredient([1, 2]));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '4', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, moveIngredient([1, 1]));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '4', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);
    });

    it('handles moveIngredient action (swap with a bun)', () => {
      state = ingredientsReducer(state, addIngredient(aBun));
      state = ingredientsReducer(state, addIngredient(aSauce));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, moveIngredient([0, 1]));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, moveIngredient([1, 0]));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, moveIngredient([1, 2]));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, moveIngredient([2, 1]));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);
    });

    it('handles removeIngredient action (keep buns)', () => {
      state = ingredientsReducer(state, addIngredient(aBun));
      state = ingredientsReducer(state, addIngredient(aSauce));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, removeIngredient('1'));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, removeIngredient('2'));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);
    });

    it('handles removeIngredient action', () => {
      state = ingredientsReducer(state, addIngredient(aBun));
      state = ingredientsReducer(state, addIngredient(aSauce));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '3', refId: aSauce._id },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);

      state = ingredientsReducer(state, removeIngredient('3'));

      expect(state.actualIngredients).toEqual([
        { id: '1', isLocked: true, refId: aBun._id, type: 'top' },
        { id: '2', isLocked: true, refId: aBun._id, type: 'bottom' },
      ]);
    });
  });
});
