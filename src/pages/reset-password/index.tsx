/* eslint-disable id-blacklist */
/* eslint-disable node/no-missing-import */
import {
  useEffect,
  useState,
} from 'react';
import {
  Link,
  Navigate,
} from 'react-router-dom';
import {
  Input,
  Button,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';

import {
  interruptPasswordResettingWorkflow,
  PasswordResettingPhase,
  requestNewPasswordSetting,
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

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const {  passwordResettingPhase } = useAppSelector(getUser);

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    return () => {
      dispatch(interruptPasswordResettingWorkflow());
    };
  }, [dispatch]);

  if (
    [
      PasswordResettingPhase.fulfilled,
      PasswordResettingPhase.initial,
      PasswordResettingPhase.rejected,
    ].includes(passwordResettingPhase)
  ) {
    return <Navigate to = { r.login } />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordResettingPhase === PasswordResettingPhase.requestingCredentialsFromUser) {
      dispatch(requestNewPasswordSetting({ password, token }));
    }
  };

  return (
    <div className = { styles.container }>
      <h2 className = 'text text_type_main-medium mb-6'>{ l('password_recovery') }</h2>
      <form className = { `${styles.form}` } onSubmit = { handleSubmit }>
        <PasswordInput
          name = 'password'
          value = { password }
          onChange = { e => setPassword(e.target.value) }
          placeholder = { l('enter_a_new_password') }
          extraClass = 'mb-6' />
        <Input
          name = 'token'
          value = { token }
          onChange = { e => setToken(e.target.value) }
          placeholder = { l('enter_the_code_from_the_letter') }
          extraClass = 'mb-6' />
        <Button
          type = 'primary'
          size = 'medium'
          htmlType = 'submit'
          extraClass = 'mb-20'>
          { l('save') }
        </Button>
      </form>
      <p className = 'text text_type_main-default text_color_inactive pb-4'>
        { l('remembered_the_password') }
        <Link to = { r.login } className = { styles.link }>{ l('to_come_in') }</Link>
      </p>
    </div>
  );
};

export { ResetPasswordPage };
