import {
  useState,
  useEffect,
  useCallback,
} from 'react';

import styles from './index.module.css';
import l from '../../utils/lang';

// eslint-disable-next-line node/no-missing-import
import AppHeader from '../app-header';
import {
  BurgerConstructor,
  BurgerIngredients,
// eslint-disable-next-line node/no-missing-import
} from '../burger';
// eslint-disable-next-line node/no-missing-import
import Modal from '../modal';
// eslint-disable-next-line node/no-missing-import
import OrderDetails from '../order-details';
// eslint-disable-next-line node/no-missing-import
import IngredientDetails from '../ingredients/details';
import { BurgerContext } from '../../utils/context/burger';
import {
  fetchIngredients,
  fetchCreateOrder,
} from '../../utils/api';
import { IngredientType as Type } from '../../utils/consts';

const randomFirstIngredient = Math.floor(Math.random() * 12);
const randomLastIngredient = Math.floor(Math.random() * 6) + 1 + randomFirstIngredient;

function App() {
  const [ingredientsData, setIngredientsData] = useState({
    items: [],
    isLoading: false,
    hasLoaded: false,
    hasError: false,
  });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({});
  const [selectedItem, setSelectedItem] = useState([]);

  useEffect(() => {
    setIngredientsData({
      ...ingredientsData, isLoading: true, hasError: false, hasLoaded: false,
    });

    fetchIngredients()
      .then(data => setIngredientsData({
        ...ingredientsData, items: data, isLoading: false, hasLoaded: true, hasError: false,
      }))
      .catch(() => setIngredientsData({
        ...ingredientsData, isLoading: false, hasError: true, hasLoaded: false,
      }));
  }, []);

  const bunItem = ingredientsData.items.find(item => item.type === Type.BUN);
  const middleItems = ingredientsData.items
    .filter(item => item.type === Type.SAUCE || item.type === Type.MAIN)
    .slice(randomFirstIngredient, randomLastIngredient);
  const orderedItems = {
    bunItem,
    middleItems,
  };

  const closeAllModals = () => {
    setIsOrderModalOpen(false);
    setIsIngredientModalOpen(false);
  };

  const openOrderModal = () => {
    const stuffing = middleItems.map(x => x._id);
    const ids = [bunItem._id, ...stuffing, bunItem._id];

    // eslint-disable-next-line promise/catch-or-return
    fetchCreateOrder({ ingredients: ids })
      .then(data => setOrderData({ ...data }))
      .catch(() => setOrderData({ success: false }))
      .finally(() => {
        setIsOrderModalOpen(true);
      });
  };

  const openIngredientModal = useCallback((clickedItem) => {
    setSelectedItem(clickedItem);
    setIsIngredientModalOpen(true);
  }, [],
  );

  return (
    <>
      <AppHeader />
      {
        ingredientsData.hasError && !ingredientsData.isLoading && !ingredientsData.hasLoaded && (
          <h2 className = { `${styles.fullscreen_message} text text_type_main-large text_color_inactive` }>
            { l('loading_error') }
          </h2>
        ) }
      {
        ingredientsData.isLoading && !ingredientsData.hasError && !ingredientsData.hasLoaded && (
          <h2 className = { `${styles.fullscreen_message} text text_type_main-large text_color_inactive` }>
            { l('loading') }...
          </h2>
        ) }
      {
        ingredientsData.hasLoaded && !ingredientsData.hasError && !ingredientsData.isLoading && (
          <BurgerContext.Provider value = { {
            items: ingredientsData.items,
            orderedItems,
            onOrderButtonClick: openOrderModal,
            onIngredientClick: openIngredientModal,
          } }>
            <div className = { styles.container }>
              <section className = { `${styles.container_left} mr-5` }>
                <BurgerIngredients />
              </section>
              <section className = { `${styles.container_right} ml-5` }>
                <BurgerConstructor />
              </section>
            </div>
          </BurgerContext.Provider>
        ) }
      {
        isOrderModalOpen && (
          <Modal
            header = { null }
            closeModal = { closeAllModals }
            isFancyCloseIcon >
            <OrderDetails orderData = { orderData } />
          </Modal>
        ) }
      {
        isIngredientModalOpen && (
          <Modal
            header = { l('ingredient_details') }
            closeModal = { closeAllModals } >
            <IngredientDetails item = { selectedItem } />
          </Modal>
        ) }
    </>
  );
}

export default App;
