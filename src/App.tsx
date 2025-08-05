import React, { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import axios from "axios";

// Pages
import Family from "./containers/Family";
import Users from "./containers/Users";
import Profile from "./containers/Profile";

import Login from "./containers/Auth/Login";
import Register from "./containers/Auth/Register";
import ForgotPassword from "./containers/Auth/ForgotPassword";
import ResetPassword from "./containers/Auth/ResetPassword";

import ForbiddenPage from "./containers/Errors/403";
import NotFoundPage from "./containers/Errors/404";
import ServerErrorPage from "./containers/Errors/500";
import Person from "./containers/Family/member";

// Layouts
import BaseLayout from "./layouts/BaseLayout";
import LoginLayout from "./layouts/LoginLayout";

// Contexts & Theme
import Theme from "./theme";
import { UserProvider } from "./context/User";
import { useError, ErrorProvider } from "./context/Error";

// Components
import { withToastProvider } from "./components/toast";
import RenderCompleted from "./hooks/RenderCompleted";
import useAuthService from "./hooks/useAuthService";

import "./App.scss";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND;

// Attach Authorization header
axios.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const userData = JSON.parse(user);
    if (config.headers) {
      config.headers['Authorization'] = `Bearer ${userData.token}`;
    }
  }
  return config;
});

// Protect routes after auth
const PrivateRoutes = () => {
  const { authenticate } = useAuthService();
  const authenticatedRef = useRef(false);
  const [initialized, setInitialized] = useState(false);
  const location = useLocation();
  const { setError } = useError();

  useEffect(() => {
    setError(false);
  }, [location?.pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      authenticatedRef.current = await authenticate();
      setInitialized(true);
    };
    checkAuth();
  }, []);

  if (!initialized) return null;

  return authenticatedRef.current ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
  const { error, setError } = useError();
  const isMounted = RenderCompleted();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (err) => {
        const originalRequest = err.config;

        if (originalRequest.excludeInterceptor || originalRequest.method !== "get") {
          return Promise.reject(err);
        }

        const status = err?.response?.status;

        if (status === 404 && !originalRequest._retry) {
          setError("404");
        } else if (status === 403 && !originalRequest._retry) {
          setError("403");
        } else if (status === 401) {
          if (!err?.response?.request?.responseURL?.includes("/login")) {
            localStorage.removeItem("user");
            //window.location.assign("/login");
          }
        }

        return Promise.reject(err);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  if (!isMounted) return null;

  return (
    <UserProvider>
      <Theme>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<LoginLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<BaseLayout />}>
              <Route element={<PrivateRoutes />}>
                <Route index element={<Family />} />
                <Route path="/users" element={<Users />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/family/:id" element={<Person />} />

              </Route>
            </Route>

            {/* Fallback: for undefined routes */}
            <Route path="*" element={
              error === "403" ? <ForbiddenPage />
              : error === "404" ? <NotFoundPage />
              : error ? <ServerErrorPage />
              : <NotFoundPage />
            } />
          </Routes>
        </BrowserRouter>
      </Theme>
    </UserProvider>
  );
};

export default withToastProvider(() => (
  <ErrorProvider>
    <App />
  </ErrorProvider>
));
