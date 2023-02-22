import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';

import MenuItem from '../menu-item';

function AppHeader() {
  return (
    <header>
      <nav className={styles.header_container}>
        <ul className={styles.header_list}>
          <ul className={styles.header_align_left}>
            <MenuItem icon={<BurgerIcon type="primary" />} text="Конструктор" link="#" active />
            <MenuItem icon={<ListIcon type="secondary" />} text="Лента заказов" link="#" />
          </ul>
          <li className={styles.header_align_center}>
            <Logo />
          </li>
          <span className={styles.header_align_right}>
            <MenuItem icon={<ProfileIcon type="secondary" />} text="Личный кабинет" link="#" />
          </span>
        </ul>
      </nav>
    </header>
  );
}

export default AppHeader;
