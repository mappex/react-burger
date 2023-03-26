/* eslint-disable id-blacklist */
import {
  useEffect,
  useState,
  MouseEvent,
  ChangeEvent,
} from 'react';
import {
  Input,
  Button,
  EmailInput,
  PasswordInput,
} from '@ya.praktikum/react-developer-burger-ui-components';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../services/store';
import {
  updateUserData,
  UpdateUserDataPhase,
  interruptUpdateUserData,
} from '../../../services/reducers/user';
import {
  getUser,
} from '../../../services/selectors';

import styles from '../index.module.css';
import l from '../../../utils/lang';

const emptyUser = { email: '', name: '' };

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const { user, updateUserDataPhase } = useAppSelector(getUser);
  const { name, email } =  user  || emptyUser;

  const [state, setState] = useState({
    name: name,
    email: email,
    password: '',
  });

  useEffect(() => {
    return () => {
      dispatch(interruptUpdateUserData());
    };
  }, [dispatch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: MouseEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (updateUserDataPhase === UpdateUserDataPhase.initial) {
      dispatch(updateUserData(state));
    }
  };

  const handleClearForm = () => {
    setState({ ...state, name: name, email: email });
  };

  return (
    <form onSubmit = { handleSubmit }>
      <Input
        onChange = { handleChange }
        value = { state.name }
        name = 'name'
        extraClass = 'mb-6'
        placeholder = { l('name') }
        icon = { 'EditIcon' } />
      <EmailInput
        onChange = { handleChange }
        value = { state.email }
        name = 'email'
        extraClass = 'mb-6'
        placeholder = { l('login') }
        isIcon = { true } />
      <PasswordInput
        onChange = { handleChange }
        value = { state.password }
        name = 'password'
        extraClass = 'mb-6'
        placeholder = { l('password') }
        icon = { 'EditIcon' } />
      { state.password !== '' || state.name !== name || state.email !== email ? (
        <div className = { styles.buttons }>
          <Button
            htmlType = 'button'
            type = 'secondary'
            size = 'medium'
            onClick = { handleClearForm } >
            { l('cancel') }
          </Button>
          <Button
            htmlType = 'submit'
            type = 'primary'
            size = 'medium'>
            { l('save') }
          </Button>
        </div>) : null }
    </form>
  );
};

export { UserProfile };
