/* eslint-disable id-blacklist */
/* eslint-disable node/no-missing-import */
import {
  useEffect,
  useState,
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
  getUser,
} from '../../../services/selectors';

import styles from '../index.module.css';
import l from '../../../utils/lang';

const Profile = () => {
  const dispatch = useAppDispatch();

  // const { name, email } = useSelector(store => store.user.user);

  const [state, setState] = useState({
    name: 'name',
    email: 'email',
    password: '',
  });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // dispatch(getProfile());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // dispatch(patchProfile(state.name, state.email, state.password));
  };

  const handleClearForm = () => {
    // setState({ ...state, name: name, email: email });
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
        icon = { 'EditIcon' } />
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

export { Profile };
