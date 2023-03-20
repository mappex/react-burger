/* eslint-disable node/no-missing-import */
import { DndProvider } from 'react-dnd';
import { HTML5Backend as Html5Backend } from 'react-dnd-html5-backend';

import styles from './index.module.css';
import style from '../../components/burger/constructor/index.module.css';

import { Modal } from '../../components/modal';
import { BurgerIngredients } from '../../components/burger/ingredients';
import { BurgerConstructor } from '../../components/burger/constructor';
import { OrderDetails } from '../../components/modal/order-details';

import { resetOrderDetails } from '../../services/reducers/order-details';
import {
  useAppDispatch,
  useAppSelector,
} from '../../services/store';
import {
  getOrderDetails,
} from '../../services/selectors';

const MainPage = () => {
  const { orderDetails } = useAppSelector(getOrderDetails);
  const dispatch = useAppDispatch();

  return (
    <div className = { `${styles['home-body']} pl-5 pr-5 text text_type_main-default` }>
      <DndProvider backend = { Html5Backend }>
        <BurgerIngredients className = { styles['home-body__ingredients'] } />
        <div className = { `${styles['home-body__space']} pl-10` } />
        <BurgerConstructor className = { styles['home-body__constructor'] } />
      </DndProvider>
      {
        orderDetails && (
          <Modal onClose = { () => dispatch(resetOrderDetails()) }>
            <OrderDetails
              className = { `${style['burger-constructor__order-details']} mt-4 mb-20` }
              orderDetails = { orderDetails } />
          </Modal>)
      }
    </div>
  );
};

export { MainPage };
