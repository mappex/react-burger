/* eslint-disable id-blacklist */
/* eslint-disable node/no-missing-import */
import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {
  Button,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';

import {
  login,
  UserLoginPhase,
  interruptUserLogin,
} from '../../services/reducers/user';

import {
  useAppDispatch,
  useAppSelector,
} from '../../services/store';
import {
  getUser,
} from '../../services/selectors';

import styles from './index.module.css';
import l from '../../utils/lang';
import r from '../../utils/routes';

const SignInPage = () => {
  const dispatch = useAppDispatch();
  const { userLoginPhase } = useAppSelector(getUser);
  const { state } = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return () => {
      if ([UserLoginPhase.rejected].includes(userLoginPhase)) {
        dispatch(interruptUserLogin());
      }
    };
  }, [dispatch, userLoginPhase]);

  if ([UserLoginPhase.fulfilled].includes(userLoginPhase)) {
    const { redirectedFrom = r.home } = state || {};

    return <Navigate to = { redirectedFrom } replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if ([UserLoginPhase.initial, UserLoginPhase.rejected].includes(userLoginPhase)) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <div className = { `${styles.container}` }>
      <h2 className = { 'text text_type_main-medium mb-6' }>{ l('entrance') }</h2>
      <form className = { `${styles.form}` } onSubmit = { handleSubmit }>
        <EmailInput
          onChange = { e => setEmail(e.target.value) }
          value = { email }
          name = { 'email' }
          extraClass = 'mb-6' />
        <PasswordInput
          onChange = { e => setPassword(e.target.value) }
          value = { password }
          name = { 'password' }
          extraClass = 'mb-6' />
        <Button
          type = 'primary'
          size = 'medium'
          htmlType = { 'submit' }
          extraClass = 'mb-20'>
          { l('to_come_in') }
        </Button>
      </form>
      <p className = { 'text text_type_main-default text_color_inactive pb-4' }>{ l('are_you_a_new_user') }
        <Link className = { styles.link } to = { r.registration }>{ l('register') }</Link>
      </p>
      <p className = { 'text text_type_main-default text_color_inactive pb-4' }>{ l('forgot_your_password') }
        <Link className = { styles.link } to = { r.forgot_password }>{ l('restore_password') }</Link>
      </p>
    </div>
  );
};

export { SignInPage };
