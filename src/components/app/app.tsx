import '../../index.css';
import { ReactNode, useEffect } from 'react';
import styles from './app.module.css';

import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import { Preloader } from '@ui';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  Location
} from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUser } from '../../services/slices/auth-slice';
import { getCookie } from '../../utils/cookie';

const FeedOrderModal = () => {
  const navigate = useNavigate();

  return (
    <Modal title='Детали заказа' onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};

const IngredientDetailsModal = () => {
  const navigate = useNavigate();

  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};

const ProfileOrderModal = () => {
  const navigate = useNavigate();

  return (
    <Modal title='Детали заказа' onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    if (!isAuthenticated && !isLoading && (accessToken || refreshToken)) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, isLoading, accessToken, refreshToken]);

  if (isLoading || (!isAuthenticated && (accessToken || refreshToken))) {
    return <Preloader />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const RequireUnauth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const accessToken = getCookie('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const from = (location.state as { from?: Location })?.from?.pathname || '/';

  useEffect(() => {
    if (!isAuthenticated && !isLoading && (accessToken || refreshToken)) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, isLoading, accessToken, refreshToken]);

  if (isLoading || (!isAuthenticated && (accessToken || refreshToken))) {
    return <Preloader />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const backgroundLocation = (location.state as { background?: Location })
    ?.background;

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={
            <RequireUnauth>
              <Login />
            </RequireUnauth>
          }
        />
        <Route
          path='/register'
          element={
            <RequireUnauth>
              <Register />
            </RequireUnauth>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RequireUnauth>
              <ForgotPassword />
            </RequireUnauth>
          }
        />
        <Route
          path='/reset-password'
          element={
            <RequireUnauth>
              <ResetPassword />
            </RequireUnauth>
          }
        />
        <Route
          path='/profile'
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <RequireAuth>
              <ProfileOrders />
            </RequireAuth>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <RequireAuth>
              <OrderInfo />
            </RequireAuth>
          }
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path='/feed/:number' element={<FeedOrderModal />} />
          <Route
            path='/profile/orders/:number'
            element={
              <RequireAuth>
                <ProfileOrderModal />
              </RequireAuth>
            }
          />
          <Route path='/ingredients/:id' element={<IngredientDetailsModal />} />
        </Routes>
      )}
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken || refreshToken) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
