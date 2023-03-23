import { FC } from 'react';
import {
  Navigate,
  useLocation,
} from 'react-router-dom';

import { UserLoginPhase } from '../services/reducers/user';
import { useAppSelector } from '../services/store';
import { getUser } from '../services/selectors';

import r from '../utils/routes';

interface IProps {
  element: React.ReactElement;
}

const ProtectedRoute: FC<IProps> = ({ element }) => {
  const { userLoginPhase } = useAppSelector(getUser);
  const { pathname } = useLocation();

  return userLoginPhase === UserLoginPhase.fulfilled ? element : (
    <Navigate
      to = { r.login }
      state = { { redirectedFrom: pathname } }
      replace />
  );
};

export { ProtectedRoute };
