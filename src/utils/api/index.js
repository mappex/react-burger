import {
  API_HOST,
} from './consts';

const checkReponse = (res) => {
  return res.ok ? res.json() : res.json().then((error) => {
    throw new Error(error);
  });
};

export const fetchIngredients = async () => {
  const response = await fetch(`${API_HOST}/api/ingredients1`).then(checkReponse);

  if (response.success === true) {
    return response.data;
  }

  throw new Error('Can\'t get data from server');
};

export const fetchCreateOrder = async ({ ingredients }) => {
  const response = await fetch(`${API_HOST}/api/orders`, {
    body: JSON.stringify({ ingredients }),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    method: 'POST',
  }).then(checkReponse);

  if (response.success === true) {
    return {
      id: response.order.number,
      success: response.success,
    };
  }

  throw new Error('Can\'t get data from server');
};

