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

import { apiIngredientsList } from '../../utils/api';

function App() {
  const [ingredientsData, setIngredientsData] = useState({
    items: [],
    isLoading: false,
    hasLoaded: false,
    hasError: false,
  });
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);

  const [orderId, setOrderId] = useState('034536');

  const [selectedItem, setSelectedItem] = useState([]);

  useEffect(() => {
    const getIngredientsData = () => {
      setIngredientsData({
        ...ingredientsData, isLoading: true, hasError: false, hasLoaded: false,
      });

      return fetch(apiIngredientsList)
        .then((res) => {
          if (!res.ok) {
            res.reject(res.statusText);
          }

          return res.json();
        })
        // eslint-disable-next-line promise/always-return
        .then(({ data }) => {
          setIngredientsData({
            ...ingredientsData, items: data, isLoading: false, hasLoaded: true, hasError: false,
          });
        })
        // eslint-disable-next-line handle-callback-err
        .catch((error) => {
          setIngredientsData({
            ...ingredientsData, isLoading: false, hasError: true, hasLoaded: false,
          });
        });
    };

    getIngredientsData();
  }, []);

  const closeAllModals = () => {
    setIsOrderModalOpen(false);
    setIsIngredientModalOpen(false);
  };

  const openOrderModal = () => {
    setIsOrderModalOpen(true);
  };

  const openIngredientModal = useCallback((clickedItem) => {
    setSelectedItem(clickedItem);
    setIsIngredientModalOpen(true);
  }, [],
  );

  const bunItem = ingredientsData.items.filter(item => item.type === 'bun')[0];
  const middleItems = ingredientsData.items.filter(item => item.type === 'sauce' || item.type === 'main').slice(4, 12);

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
          <div className = { styles.container }>
            <section className = { `${styles.container_left} mr-5` }>
              <BurgerIngredients
                items = { ingredientsData.items }
                onIngredientClick = { openIngredientModal } />
            </section>
            <section className = { `${styles.container_right} ml-5` }>
              <BurgerConstructor
                bunItem = { bunItem } middleItems = { middleItems }
                onOrderButtonClick = { openOrderModal } />
            </section>
          </div>
        ) }
      {
        isOrderModalOpen && (
          <Modal
            header = { null }
            closeModal = { closeAllModals }
            isFancyCloseIcon >
            <OrderDetails orderId = { orderId } />
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
