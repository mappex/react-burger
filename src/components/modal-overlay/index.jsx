import PropTypes from 'prop-types';

import styles from './index.module.css';

function ModalOverlay({ closeModal }) {
  return (
    <div
      className = { styles.modal_overlay }
      onClick = { closeModal }>
    </div>
  );
}

ModalOverlay.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ModalOverlay;
