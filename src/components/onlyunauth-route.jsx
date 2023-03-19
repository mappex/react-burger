/* eslint-disable node/no-missing-import */
import {
  Navigate,
} from 'react-router-dom';
import PropTypes from 'prop-types';

import { UserLoginPhase } from '../services/reducers/user';
import { useAppSelector } from '../services/store';
import { getUser } from '../services/selectors';

const OnlyUnAuthRoute = ({ element, path }) => {
  const { userLoginPhase } = useAppSelector(getUser);

  return ![UserLoginPhase.fulfilled].includes(userLoginPhase) ? element : (
    <Navigate to = { path } replace />
  );
};

OnlyUnAuthRoute.propTypes = {
  element: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  path: PropTypes.string.isRequired,
};

export { OnlyUnAuthRoute };
