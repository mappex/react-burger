import {
  shape,
  number,
  string,
} from 'prop-types';

export const ingredientsType = shape({
  name: string.isRequired,
  price: number.isRequired,
  image: string.isRequired,
});
