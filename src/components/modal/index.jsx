import PropTypes from 'prop-types';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';
// eslint-disable-next-line node/no-missing-import
import ModalOverlay from '../modal-overlay';

const renderTo = document.getElementById('modal-container');

function Modal({
  children, header, closeModal, isFancyCloseIcon = false,
}) {
  const handleEscKey = (event) => {
    if (event.key === 'Escape') closeModal();

    event.stopImmediatePropagation();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  return ReactDOM.createPortal(
    <>
      <ModalOverlay closeModal = { closeModal } />
      <div className = { `${styles.modal_container} pl-10 pt-10 pr-10 pb-15` }>
        <h3 className = { `${styles.modal_header} text text_type_main-large` }>
          { header }
        </h3>
        <span className = { `${styles.close_icon} ${isFancyCloseIcon ? styles.fancy_icon : null}` } >
          <CloseIcon onClick = { closeModal } />
        </span>
        { children }
      </div>
    </>,
    renderTo,
  );
}

Modal.propTypes = {
  header: PropTypes.string,
  fancyCloseIcon: PropTypes.bool,
  closeModal: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default Modal;
