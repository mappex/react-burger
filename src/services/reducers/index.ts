import userReducer from './user';
import ingredientsReducer from './ingredients';
import orderDetailsReducer from './order-details';
import ordersReducer from './orders';

export default {
  user: userReducer,
  ingredients: ingredientsReducer,
  orderDetails: orderDetailsReducer,
  orders: ordersReducer,
};
