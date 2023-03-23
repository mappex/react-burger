import PropTypes from 'prop-types';

import style from './index.module.css';

const ModalOverlay = ({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) => (
  <div
    className = { `${style['modal-overlay']} ${onClick && style['modal-overlay_interactive']} ${className}` }
    onClick = { onClick } />
);

ModalOverlay.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
};

export default ModalOverlay;
