/* eslint-disable node/no-missing-import */
import { DndProvider } from 'react-dnd';
import { HTML5Backend as Html5Backend } from 'react-dnd-html5-backend';

import styles from './index.module.css';
import style from '../burger/constructor/index.module.css';
import l from '../../utils/lang';

import Modal from '../modal';
import BurgerIngredients from '../burger/ingredients';
import BurgerConstructor from '../burger/constructor';
import IngredientDetails from '../ingredient-details';
import ModalOrderDetails from '../modal/order-details';

import { resetOrderDetails } from '../../services/reducers/order-details';
import { resetDetailedIngredient } from '../../services/reducers/ingredients';

import {
  useAppDispatch,
  useAppSelector,
} from '../../services/store';
import {
  getIngredients,
  getOrderDetails,
} from '../../services/selectors';

const AppBody = () => {
  const { detailedIngredient } = useAppSelector(getIngredients);
  const { orderDetails } = useAppSelector(getOrderDetails);
  const dispatch = useAppDispatch();

  return (
    <main
      className = { `${styles['app-body']} pl-5 pr-5 text text_type_main-default` }>
      <DndProvider backend = { Html5Backend }>
        <BurgerIngredients className = { styles['app-body__ingredients'] } />
        <div className = { `${styles['app-body__space']} pl-10` } />
        <BurgerConstructor className = { styles['app-body__constructor'] } />
      </DndProvider>
      {
        detailedIngredient && (
          <Modal
            title = { l('ingredient_details') }
            onClose = { () => dispatch(resetDetailedIngredient()) }>
            <IngredientDetails
              className = { style['burger-constructor__ingredient-details'] }
              ingredient = { detailedIngredient } />
          </Modal>)
      }
      {
        orderDetails && (
          <Modal onClose = { () => dispatch(resetOrderDetails()) }>
            <ModalOrderDetails
              className = { `${style['burger-constructor__order-details']} mt-4 mb-20` }
              orderDetails = { orderDetails } />
          </Modal>)
      }
    </main>
  );
};

export default AppBody;
