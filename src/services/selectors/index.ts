import { TRootState } from '../store';

export const getIngredients = (state: TRootState) => state.ingredients;

export const getOrderDetails = (state: TRootState) => state.orderDetails;

export const getUser = (state: TRootState) => state.user;

export const getOrders = (state: TRootState) => state.orders;
