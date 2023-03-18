/* eslint-disable node/no-missing-import */
import {
  Navigate,
} from 'react-router-dom';

import { UserLoginPhase } from '../services/reducers/user';
import { useAppSelector } from '../services/store';
import { getUser } from '../services/selectors';

import PropTypes from 'prop-types';

const ProtectedRouteElement = ({ element }) => {
  const { userLoginPhase } = useAppSelector(getUser);

  return userLoginPhase === UserLoginPhase.fulfilled ? element : (
    <Navigate to = '/login' replace = { true } />
  );
};

ProtectedRouteElement.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { ProtectedRouteElement };
