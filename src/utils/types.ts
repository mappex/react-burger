export enum ActualIngredientType {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum DraggableTypes {
  INGREDIENT = 'ingredient',
  ACTUALINGREDIENT = 'actualIngredient',
}

export enum IngredientType {
  BUN = 'bun',
  SAUCE = 'sauce',
  MAIN = 'main',
}

export enum TOrderStatus {
  CREATED = 'created',
  PENDING = 'pending',
  DONE = 'done',
}

export interface User {
  email: string;
  name: string;
}

export interface IRefreshTokensResponse {
  accessSchema: string;
  accessToken: string;
  refreshToken: string;
}

export interface IUserResponse {
  user: User;
}

export interface Order {
  _id: string;
  ingredients: string[];
  status: TOrderStatus;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export type TActualIngredient = {
  id: string;
  refId: string;
  isLocked?: boolean;
  type?: ActualIngredientType;
};

export type TIngredient = {
  _id: string;
  name: string;
  type: IngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export type TIngredientDragItem = {
  refId: TIngredient['_id'];
  type: IngredientType;
};

export type TActualIngredientDragItem = {
  index: number;
};

export type TOrderDetails = {
  id: number;
  status: TOrderStatus;
  message: string;
};

export type TAuthUserResponse = IRefreshTokensResponse & IUserResponse;
