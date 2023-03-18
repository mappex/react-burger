/* eslint-disable id-blacklist */
/* eslint-disable node/no-missing-import */
import {
  useState,
} from 'react';
import {
  Link,
  Navigate,
} from 'react-router-dom';
import {
  EmailInput,
  Button,
} from '@ya.praktikum/react-developer-burger-ui-components';

import {
  PasswordResettingPhase,
  requestPasswordResettingForEmail,
  UserLoginPhase,
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

const ForgotPasswordPage = () => {
  const dispatch = useAppDispatch();
  const { userLoginPhase, passwordResettingPhase } = useAppSelector(getUser);

  const [email, setEmail] = useState('');

  if ([UserLoginPhase.fulfilled].includes(userLoginPhase)) {
    return <Navigate to = { '/' } />;
  }

  if (
    [
      PasswordResettingPhase.requestingCredentialsFromUser,
      PasswordResettingPhase.pendingResetting,
      PasswordResettingPhase.fulfilled,
    ].includes(passwordResettingPhase)
  ) {
    return <Navigate to = { '/reset-password' } />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordResettingPhase === PasswordResettingPhase.initial) {
      dispatch(requestPasswordResettingForEmail({ email }));
    }
  };

  return (
    <div className = { styles.container }>
      <h2 className = 'text text_type_main-medium mb-6'>{ l('password_recovery') }</h2>
      <form className = { `${styles.form}` } onSubmit = { handleSubmit }>
        <EmailInput
          onChange = { e => setEmail(e.target.value) }
          placeholder = { l('enter_email') }
          value = { email }
          name = 'email'
          extraClass = 'mb-6' />
        <Button
          type = 'primary'
          size = 'medium'
          htmlType = 'submit'
          disabled = { !email }
          extraClass = 'mb-20'>
          { l('restore') }
        </Button>
      </form>
      <p className = 'text text_type_main-default text_color_inactive pb-4'>
        { l('remembered_the_password') }
        <Link
          to = '/login'
          className = { styles.link }>
          { l('to_come_in') }
        </Link>
      </p>
    </div>
  );
};

export { ForgotPasswordPage };
