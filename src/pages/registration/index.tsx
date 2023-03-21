/* eslint-disable id-blacklist */
import {
  useState,
  useEffect,
  MouseEvent,
} from 'react';
import {
  Link,
  Navigate,
} from 'react-router-dom';
import {
  Input,
  Button,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';

import {
  interruptUserRegistration,
  registerUser,
  UserRegistrationPhase,
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

const RegistrationPage = () => {
  const dispatch = useAppDispatch();
  const {
    userRegistrationPhase,
  } = useAppSelector(getUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    return () => {
      dispatch(interruptUserRegistration());
    };
  }, [dispatch]);

  if ([UserRegistrationPhase.fulfilled, UserRegistrationPhase.rejected].includes(userRegistrationPhase)) {
    return <Navigate to = { r.home } />;
  }

  const handleSubmit = (e: MouseEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (userRegistrationPhase === UserRegistrationPhase.initial) {
      dispatch(registerUser({ email, name, password }));
    }
  };

  return (
    <div className = { `${styles.container}` }>
      <h2 className = { 'text text_type_main-medium mb-6' }>{ l('registration') }</h2>
      <form className = { `${styles.form}` } onSubmit = { handleSubmit }>
        <Input
          onChange = { e => setName(e.target.value) }
          value = { name }
          name = 'name'
          extraClass = 'mb-6'
          placeholder = { l('name') } />
        <EmailInput
          onChange = { e => setEmail(e.target.value) }
          value = { email }
          name = 'email'
          extraClass = 'mb-6' />
        <PasswordInput
          onChange = { e => setPassword(e.target.value) }
          value = { password }
          name = 'password'
          extraClass = 'mb-6' />
        <Button
          type = 'primary'
          size = 'medium'
          htmlType = 'submit'
          extraClass = 'mb-20'>
          { l('register') }
        </Button>
      </form>
      <p className = { 'text text_type_main-default text_color_inactive pb-4' }>
        { l('already_registered') }
        <Link to = { r.login } className = { styles.link }>{ l('to_come_in') }</Link>
      </p>
    </div>
  );
};

export { RegistrationPage };
