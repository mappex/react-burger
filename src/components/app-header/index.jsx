import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
import l from '../../utils/lang';

// eslint-disable-next-line node/no-missing-import
import MenuItem from './menu-item';

function AppHeader() {
  return (
    <header>
      <nav className = { styles.menu_container }>
        <ul className = { styles.menu_list }>
          <li className = { styles.menu_list_left }>
            <ul className = { styles.menu_list_left_items }>
              <li>
                <MenuItem
                  text = { l('constructor') }
                  icon = { <BurgerIcon type = 'primary' /> }
                  link = '#' active />
              </li>
              <li>
                <MenuItem
                  text = { l('order_feed') }
                  icon = { <ListIcon type = 'secondary' /> }
                  link = '#' />
              </li>
            </ul>
          </li>
          <li className = { styles.menu_list_center }>
            <Logo />
          </li>
          <li className = { styles.menu_list_right }>
            <span>
              <MenuItem
                text = { l('personal_area') }
                icon = { <ProfileIcon type = 'secondary' /> }
                link = '#' />
            </span>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default AppHeader;
