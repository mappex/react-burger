import {
  FC,
  MouseEventHandler,
} from 'react';
import cs from 'classnames';
import { TIconProps } from '@ya.praktikum/react-developer-burger-ui-components/dist/ui/icons/utils';

import styles from './index.module.css';

type TIcon = ({ type }: TIconProps) => JSX.Element;

const MenuItem: FC<{
  className?: string;
  Icon: TIcon;
  isActive?: boolean;
  onClick?: MouseEventHandler<HTMLLIElement>;
  text: string;
}> = ({ className, Icon, isActive, onClick, text }) => {
  return (
    <li
      className = { cs(
        styles['menu-item'],
        {
          [styles['menu-item_active']]: isActive,
        },
        className,
        'p-5 text',
        {
          text_color_inactive: !isActive,
        },
      ) }
      onClick = { onClick }
      role = 'button'>
      <Icon type = { isActive ? 'primary' : 'secondary' } />
      <span className = 'ml-2'>{ text }</span>
    </li>
  );
};

MenuItem.defaultProps = {
  isActive: true,
};

export default MenuItem;
