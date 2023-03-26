import {
  Link,
  useLocation,
} from 'react-router-dom';

import { Orders } from './orders';
import { Profile } from './profile';
import {
  logout,
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

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { userTimeStamp } = useAppSelector(getUser);
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
        {
          pathname === r.profile && <Profile key = { userTimeStamp } />
        }
        {
          pathname === `${r.profile}${r.orders}` && <Orders />
        }
      </div>
    </div>
  );
};

export { ProfilePage };
