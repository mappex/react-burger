/* eslint-disable node/no-missing-import */
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import {
  logout,
  UserLoginPhase,
} from '../../services/reducers/user';
import {
  useAppDispatch,
  useAppSelector,
} from '../../services/store';
import {
  getUser,
} from '../../services/selectors';

const SignOutPage = () => {
  const { userLoginPhase } = useAppSelector(getUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userLoginPhase === UserLoginPhase.fulfilled) {
      dispatch(logout());
    }
  });

  if (
    [
      UserLoginPhase.initial,
      UserLoginPhase.pending,
      UserLoginPhase.rejected,
    ].includes(userLoginPhase)
  ) {
    return <Navigate to = { '/login' } />;
  }

  return null;
};

export { SignOutPage };
