import { FC } from 'react';
import {
  Link,
  Outlet,
  useLocation,
} from 'react-router-dom';

import {
  logout,
} from '../../services/reducers/user';
import {
  useAppDispatch,
} from '../../services/store';

import styles from './index.module.css';
import l from '../../utils/lang';
import r from '../../utils/routes';

const ProfilePage: FC = () => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  return (
    <div className = { `${styles.container} pt-25` }>
      <div className = { `${styles.links}` }>
        <Link
          className = { `${styles.link} text_color_inactive text text_type_main-medium ${pathname === r.profile && styles.active}` }
          to = { r.profile }>
          { l('profile') }
        </Link>
        <Link
          className = { `${styles.link} text_color_inactive text text_type_main-medium ${pathname === `${r.profile}${r.orders}` && styles.active}` }
          to = { `${r.profile}${r.orders}` }>
          { l('history_of_orders') }
        </Link>
        <Link
          className = { `${styles.link} text_color_inactive text text_type_main-medium` }
          onClick = { () => dispatch(logout()) }
          to = { r.login } >
          { l('exit') }
        </Link>
        <p className = { 'text text_type_main-default text_color_inactive mt-20' }>{ l('in_this_section_you_can_change_your_personal_data') }</p>
      </div>
      <div className = { `${styles.forms}` }>
        <Outlet />
      </div>
    </div>
  );
};

export { ProfilePage };
