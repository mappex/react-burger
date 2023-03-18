/* eslint-disable node/no-missing-import */
import PropTypes from 'prop-types';

import styles from './index.module.css';

const MenuItem = ({
  className,
  Icon,
  isActive,
  text,
  onClick,
}) => {
  let style = `${styles['menu-item']} ${className} p-5 text`;

  if (isActive) {
    style += ` ${styles['menu-item_active']}`;
  } else {
    style += ' text_color_inactive';
  }

  return (
    <li
      className = { style }
      onClick = { onClick }
      role = 'button'>
      <Icon type = { isActive ? 'primary' : 'secondary' } />
      <span className = 'ml-2'>{ text }</span>
    </li>
  );
};

MenuItem.propTypes = {
  className: PropTypes.string,
  Icon: PropTypes.elementType.isRequired,
  isActive: PropTypes.bool,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

MenuItem.defaultProps = {
  isActive: true,
};

export default MenuItem;
