import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, RootState } from "./store/store";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFound";
import AppNavbar from "./components/layout/Navbar/Navbar";
import { getCookie } from "./utils/cookie";
import { logout } from "./features/auth/authSlice";


const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const userToken = getCookie("userToken");
  return userToken ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }: { element: JSX.Element }) => {
  const userToken = getCookie("userToken");
  return userToken ? <Navigate to="/" /> : element;
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    const userToken = getCookie("userToken");
    if (!userToken) {
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <Provider store={store}>
      <Router>
        <AppNavbar />
        <Routes>          <Route
            path="/"
            element={
              isAuthenticated ? (
                <ProtectedRoute element={<HomePage />} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={<PublicRoute element={<LoginPage />} />}
          />
          <Route
            path="/register"
            element={<PublicRoute element={<RegisterPage />} />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
