import {
  API_HOST,
} from './consts';

export const fetchIngredients = async () => {
  const response = await fetch(`${API_HOST}/api/ingredients`);
  const result = await response.json();

  if (result.success === true) {
    return result.data;
  }

  throw new Error('Can\'t get data from server');
};

export const fetchCreateOrder = async ({ ingredients }) => {
  const response = await fetch(`${API_HOST}/api/orders`, {
    body: JSON.stringify({ ingredients }),
    headers: new Headers([['Content-Type', 'application/json']]),
    method: 'POST',
  });
  const result = await response.json();

  if (result.success === true) {
    return {
      id: result.order.number,
      success: result.success,
    };
  }

  throw new Error('Can\'t get data from server');
};

