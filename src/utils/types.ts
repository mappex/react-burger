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

export enum OrderStatus_t {
  BEING_COOKED,
  COOKED,
  BEING_DELIVERED,
  DELIVERED,
}

export interface User {
  email: string;
  name: string;
}

export interface RefreshTokensResponse {
  accessSchema: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  user: User;
}

export type ActualIngredient_t = {
  id: string;
  refId: string;
  isLocked?: boolean;
  type?: ActualIngredientType;
};

export type Ingredient_t = {
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

export type IngredientDragItem = {
  refId: Ingredient_t['_id'];
  type: IngredientType;
};

export type ActualIngredientDragItem = {
  index: number;
};

export type OrderDetails_t = {
  id: number;
  status: OrderStatus_t;
  message: string;
};

export type AuthUserResponse = RefreshTokensResponse & UserResponse;
