import { FC } from 'react';
import {
  Navigate,
  useLocation,
} from 'react-router-dom';

import { UserLoginPhase } from '../services/reducers/user';
import { useAppSelector } from '../services/store';
import { getUser } from '../services/selectors';

interface IProps {
  element: React.ReactElement;
  path: string;
}

const OnlyUnAuthRoute: FC<IProps> = ({ element, path }) => {
  const { userLoginPhase } = useAppSelector(getUser);
  const { state: locationState } = useLocation() as {
    state: { redirectedFrom?: typeof location } | null;
  };
  const { redirectedFrom = path } = locationState ?? {};

  return ![UserLoginPhase.fulfilled].includes(userLoginPhase) ? element : (
    <Navigate to = { redirectedFrom } replace />
  );
};

export { OnlyUnAuthRoute };
