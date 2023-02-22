import styles from './index.module.css';

// eslint-disable-next-line node/no-missing-import
import AppHeader from '../header';
// eslint-disable-next-line node/no-missing-import
import {
  BurgerConstructor,
  BurgerIngredients,
// eslint-disable-next-line node/no-missing-import
} from '../../burger';

import data from '../../../utils/data.json';

const topItem = data[0];
const middleItems = data.slice(4, 12);
const bottomItem = data[0];

function App() {
  return (
    <>
      <AppHeader />
      <div className = { styles.app_content }>
        <section className = { `${styles.app_container} mr-5` }>
          <BurgerIngredients items = { data } />
        </section>
        <section className = { `${styles.app_container} ml-5` }>
          <BurgerConstructor
            topItem = { topItem }
            middleItems = { middleItems }
            bottomItem = { bottomItem } />
        </section>
      </div>
    </>
  );
}

export default App;
