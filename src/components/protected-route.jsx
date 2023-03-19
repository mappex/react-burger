/* eslint-disable node/no-missing-import */
import {
  Navigate,
  useLocation,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import { UserLoginPhase } from '../services/reducers/user';
import { useAppSelector } from '../services/store';
import { getUser } from '../services/selectors';

import r from '../utils/routes';

const ProtectedRoute = ({ element }) => {
  const { userLoginPhase } = useAppSelector(getUser);
  const { pathname } = useLocation();

  return userLoginPhase === UserLoginPhase.fulfilled ? element : (
    <Navigate
      to = { r.login }
      state = { { redirectedFrom: pathname } }
      replace />
  );
};

ProtectedRoute.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { ProtectedRoute };
