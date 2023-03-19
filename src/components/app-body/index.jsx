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
import { ProtectedRoute } from '../protected-route';
import { OnlyUnAuthRoute } from '../onlyunauth-route';

import styles from './index.module.css';
import burgerConstructorStyles from '../burger/constructor/index.module.css';
import l from '../../utils/lang';
import r from '../../utils/routes';

const AppBody = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <main className = { `${styles['app-body']} pl-5 pr-5 text text_type_main-default` }>
      <Routes location = { background || location }>
        <Route path = { r.home } element = { <MainPage /> } />
        <Route path = { r.feed } element = { <FeedPage /> } />
        <Route path = { r.logout } element = { <SignOutPage /> } />
        <Route path = { r.ingredientsById } element = { <IngredientsPage /> } />
        <Route
          path = { r.login }
          element = { <OnlyUnAuthRoute path = { r.home } element = { <SignInPage /> } /> } >
        </Route>
        <Route
          path = { r.registration }
          element = { <OnlyUnAuthRoute path = { r.login } element = { <RegistrationPage /> } /> } >
        </Route>
        <Route
          path = { r.forgot_password }
          element = { <OnlyUnAuthRoute path = { r.home } element = { <ForgotPasswordPage /> } /> } >
        </Route>
        <Route
          path = { r.reset_password }
          element = { <OnlyUnAuthRoute path = { r.home } element = { <ResetPasswordPage /> } /> } >
        </Route>
        <Route
          path = { r.profile }
          element = { <ProtectedRoute element = { <ProfilePage /> } /> } >
        </Route>
        <Route path = { r.notfound } element = { <NotFoundPage /> } />
      </Routes>
      {
        background && (
          <Routes>
            <Route
              path = { r.ingredientsById }
              element = {
                <Modal
                  title = { l('ingredient_details') }
                  onClose = { () => navigate(r.home) }>
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
