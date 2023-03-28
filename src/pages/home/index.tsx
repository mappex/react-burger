import cs from 'classnames';
import { DndProvider } from 'react-dnd';
import { HTML5Backend as Html5Backend } from 'react-dnd-html5-backend';

import styles from './index.module.css';
import pageStyles from '../index.module.css';
import burgerConstructorStyles from '../../components/burger/constructor/index.module.css';

import { Modal } from '../../components/modal';
import { BurgerIngredients } from '../../components/burger/ingredients';
import { BurgerConstructor } from '../../components/burger/constructor';
import { PlacedOrderDetails } from '../../components/placed-order-details';

import { resetOrderDetails } from '../../services/reducers/order-details';
import {
  useAppDispatch,
  useAppSelector,
} from '../../services/store';
import {
  getOrderDetails,
} from '../../services/selectors';

const MainPageCls = 'main-page';

const MainPage = () => {
  const { orderDetails } = useAppSelector(getOrderDetails);
  const dispatch = useAppDispatch();

  return (
    <div
      className = { cs(
        pageStyles.page,
        pageStyles[`page_${MainPageCls}`],
        styles[MainPageCls],
      ) }>
      { /* @ts-ignore */ }
      <DndProvider backend = { Html5Backend }>
        <BurgerIngredients
          className = { styles[`${MainPageCls}__ingredients`] } />
        <div className = { cs(styles[`${MainPageCls}__space`], 'pl-10') } />
        <BurgerConstructor
          className = { styles[`${MainPageCls}__constructor`] } />
      </DndProvider>
      { orderDetails && (
        <Modal onClose = { () => dispatch(resetOrderDetails()) }>
          <PlacedOrderDetails
            className = { cs(
              burgerConstructorStyles['burger-constructor__order-details'],
              'mt-4 mb-20',
            ) }
            orderDetails = { orderDetails } />
        </Modal>
      ) }
    </div>
  );
};

export { MainPage };
