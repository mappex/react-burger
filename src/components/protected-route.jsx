/* eslint-disable node/no-missing-import */
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import { UserLoginPhase } from '../services/reducers/user';
import { useAppSelector } from '../services/store';
import { getUser } from '../services/selectors';

import PropTypes from 'prop-types';

const ProtectedRouteElement = ({ element, ...rest }) => {
  const { userLoginPhase } = useAppSelector(getUser);

  return (
    <Routes>
      <Route
        { ...rest }
        render = { () => {
          return userLoginPhase === UserLoginPhase.fulfilled ? element : (
            <Navigate to = '/login' replace = { true } />
          );
        } } />
    </Routes>
  );
};

ProtectedRouteElement.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { ProtectedRouteElement };
