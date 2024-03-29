import { userReducer } from './user';
import { ordersReducer } from './orders';
import { ingredientsReducer } from './ingredients';
import { orderDetailsReducer } from './order-details';

export default {
  user: userReducer,
  ingredients: ingredientsReducer,
  orderDetails: orderDetailsReducer,
  orders: ordersReducer,
};
