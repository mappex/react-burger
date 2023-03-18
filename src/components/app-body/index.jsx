/* eslint-disable node/no-missing-import */
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import {
  FeedPage,
  ForgotPasswordPage,
  IngredientsPage,
  SignInPage,
  SignOutPage,
  MainPage,
  NotFoundPage,
  ProfilePage,
  RegistrationPage,
  ResetPasswordPage,
} from '../../pages';
import { Modal } from '../modal';
import { IngredientDetails } from '../ingredient-details';
import { ProtectedRouteElement } from '../protected-route';

import styles from './index.module.css';
import burgerConstructorStyles from '../burger/constructor/index.module.css';
import l from '../../utils/lang';

const AppBody = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <main className = { `${styles['app-body']} pl-5 pr-5 text text_type_main-default` }>
      <Routes location = { background || location }>
        <Route path = '/' element = { <MainPage /> } />
        <Route path = '/login' element = { <SignInPage /> } />
        <Route path = '/logout' element = { <SignOutPage /> } />
        <Route path = '/register' element = { <RegistrationPage /> } />
        <Route path = '/forgot-password' element = { <ForgotPasswordPage /> } />
        <Route path = '/reset-password' element = { <ResetPasswordPage /> } />
        <Route path = '/ingredients/:id' element = { <IngredientsPage /> } />
        <Route
          path = '/profile'
          element = { <ProtectedRouteElement element = { <ProfilePage /> } /> } >
        </Route>
        <Route path = '/feed' element = { <FeedPage /> } />
        <Route path = '*' element = { <NotFoundPage /> } />
      </Routes>
      {
        background && (
          <Routes>
            <Route
              path = '/ingredients/:id'
              element = {
                <Modal
                  title = { l('ingredient_details') }
                  onClose = { () => navigate('/') }>
                  <IngredientDetails className = { burgerConstructorStyles['burger-constructor__ingredient-details'] } />
                </Modal> } >
            </Route>
          </Routes>
        )
      }
    </main>
  );
};

export default AppBody;
