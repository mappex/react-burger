/* eslint-disable node/no-missing-import */
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import {
  useNavigate,
  useLocation,
} from 'react-router-dom';

import styles from './index.module.css';
import l from '../../utils/lang';

import MenuItem from './menu-item';

const AppHeader = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header
      className = { `${styles['app-header']} text text_type_main-default pt-3 pb-3` }>
      <nav>
        <ul className = { `${styles['app-header__menu-list']} pt-4 pb-4` }>
          <MenuItem
            className = { styles['app-header__menu-item'] }
            Icon = { BurgerIcon }
            text = { l('constructor') }
            isActive = { pathname === '/' }
            onClick = { () => navigate('/') } />
          <MenuItem
            className = { styles['app-header__menu-item'] }
            Icon = { ListIcon }
            text = { l('order_feed') }
            isActive = {  pathname === '/feed' }
            onClick = { () => navigate('/feed') } />
          <li className = { styles['app-header__logo-wrapper'] }>
            <Logo />
          </li>
          <MenuItem
            className = { styles['app-header__menu-item'] }
            Icon = { ProfileIcon }
            text = { l('personal_area') }
            isActive = {  pathname === '/profile' }
            onClick = { () => navigate('/profile') } />
        </ul>
      </nav>
    </header>
  );
};

export default AppHeader;
