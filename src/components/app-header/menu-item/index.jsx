import PropTypes from 'prop-types';

import styles from './index.module.css';

function MenuItem({
  active, link, text, icon,
}) {
  return (
    <a
      className = { `${styles.menu_list_item} pl-5 pr-5 pt-4 pb-4 mt-4 mb-4 mr-2 ${active ? styles.menu_list_item_active : null}` }
      href = { link }
      title = { text }>
      <span className = { `${styles.menu_list_item_icon} mr-2` }>
        { icon }
      </span>
      <span className = { `${styles.menu_list_item_text} text text_type_main-default text_color_inactive` }>
        { text }
      </span>
    </a>
  );
}

MenuItem.propTypes = {
  active: PropTypes.bool,
  link: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
};

export default MenuItem;
