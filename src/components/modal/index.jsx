/* eslint-disable node/no-missing-import */
import {
  useCallback,
  useEffect,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';

import styles from './index.module.css';

import ModalOverlay from './overlay';

const Modal = ({
  children, className, onClose, title,
}) => {
  const modalElementRef = useRef(null);

  useEffect(() => {
    const {
      current: modalElement,
    } = modalElementRef;

    if (modalElement) {
      modalElement.focus();
    }
  }, []);

  const keyDownHandler = useCallback(({ key }) => {
    if (key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <>
      <ModalOverlay className = { styles.modal__overlay } onClick = { onClose } />
      <div
        ref = { modalElementRef }
        className = { `${styles.modal} p-10 ${className}` }
        onKeyDown = { keyDownHandler }
        tabIndex = { 0 }>
        <div className = { styles.modal__header }>
          <div
            className = { `${styles.modal__title} text text_type_main-large` }>
            { title }
          </div>
          <button className = { styles['modal__close-button'] } onClick = { onClose }>
            <CloseIcon type = { 'primary' } />
          </button>
        </div>
        <div className = { styles.modal__content }>
          { children }
        </div>
      </div>
    </>
  );
};

Modal.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default Modal;
