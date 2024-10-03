import React, { useRef, useState } from "react";
import { BrowserRouter, Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";

// containers
import ForbiddenPage from "./containers/Errors/403";
import NotFoundPage from "./containers/Errors/404";
import ServerErrorPage from "./containers/Errors/500";

import ForgotPassword from "./containers/Auth/ForgotPassword";
import Login from "./containers/Auth/Login";
import ResetPassword from "./containers/Auth/ResetPassword";
import Register from "./containers/Auth/Register";

import Dashboard from "./containers/Dashboard";
import Users from "./containers/Users";

// components
import { withToastProvider } from "./components/toast";

// layouts
import BaseLayout  from "./layouts/BaseLayout";
import LoginLayout from "./layouts/LoginLayout";
import LoadingLayout from "./layouts/LoadingLayout";

// misc
import Theme from "./theme";
import { UserProvider } from "./context/User";
import { useError } from "./context/Error";
import { refreshToken } from "./api/Auth/index";

import RenderCompleted  from "./hooks/RenderCompleted";
import useVersionCheck from './hooks/useVersionCheck';


import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

// third party modules
import axios from "axios";
import { useEffect } from "react";
import useAuthService from "hooks/useAuthService";

axios.defaults.baseURL = process.env.REACT_APP_BACKEND;

// We do this to all outgoing requests automatically get bearer token if we're logged in.
// This is fine because the vast majority of requests are for protected area (its a dashboard afterall)
axios.interceptors.request.use(  
  function (config) {
  
    const user = localStorage.getItem("user");    
    if (user && !config?.url?.includes("/auth/refresh")) {      
      const userData = JSON.parse(user);
      config.headers["Authorization"] = `Bearer ${userData.tokens.accessToken}`;
      return config;    
    } else { 
      return config; 
    }
  },
  function (error) { return Promise.reject(error); }

);

const PrivateRoutes = () => {
  const { setError } = useError();
  const { authenticate } = useAuthService();
  const authenticatedRef = useRef(false);
  const [initialized, setInitialized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location) { setError(false); }
  }, [location?.pathname]);

  const checkAuthentication = async () => {
    authenticatedRef.current = await authenticate();
    setInitialized(true);      
  };

  useEffect(() => {
    if (!initialized) {
      checkAuthentication();
    }
  }, [initialized]);

  if (!initialized) return null;
  return authenticatedRef.current ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  
  const { error, setError } = useError();
  const isMounted = RenderCompleted();
  const hasNewVersion = useVersionCheck();

  useEffect(() => {
    if (hasNewVersion) {
      if (window.confirm('A new version is available. Refresh to update?')) {
        window.location.reload();
      }
    }
  }, [hasNewVersion]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      function (response) {
        return response;
      }, async function (err) {    
        const originalRequest = err.config;
        const user = localStorage.getItem("user");  
        
        if (originalRequest.excludeInterceptor || originalRequest.method !== 'get') {
          return Promise.reject(err); // Exclude this request from interceptor
        }

        /*
        if (err.response.status >= 500 && err.response.status <= 599 &&!originalRequest._retry) {
          setError("500");
        } else 
        */
        if (err.response.status === 404 && !originalRequest._retry) {      
          setError("404");
        } else if (err.response.status === 403 && !originalRequest._retry) {
          setError("403");
        } else if (err.response.status === 401) {
          if (!err.response.request.responseURL.includes("/login")) {
            originalRequest._retry = true;
            //if user is in local storage use refresh token to update token
            if (user) {
              const userData = JSON.parse(user);
              localStorage.removeItem("user");
              const res = await refreshToken({ data : { id: userData.id, refreshToken: userData.tokens.refreshToken }});          
              localStorage.setItem("user", JSON.stringify({user_id : res?.user.id, tokens : {...res?.tokens}}));
              return axios(originalRequest);                  
            } else {          
              window.location.assign("/login");
              localStorage.removeItem("user");
              return Promise.reject(err);        
            } 
          } else { 
            return Promise.reject(err); 
          }
        } else { 
          return Promise.reject(err); 
        }      
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  if(!isMounted){ return null }

  if(error && error !== "404"){
    return <Theme>
      {error === "403" && <ForbiddenPage />}                     
      {!["403"].includes(error) && <ServerErrorPage />} 
    </Theme>
  }

  return (    
    <UserProvider>
      <Theme>
        <BrowserRouter>
          <Routes>
            <Route element={<LoadingLayout />}>                
              <Route path="/" />
            </Route>

            <Route element={<BaseLayout />}>
              <Route element={<PrivateRoutes/>}>
                <Route path="/dashboard" element={error === "404" ? <NotFoundPage /> : <Dashboard />} />                
                <Route path="/users" element={error === "404" ? <NotFoundPage /> : <Users />} />
                <Route path="/*" element={<NotFoundPage />} />                           
              </Route>                          
            </Route>

            <Route element={<LoginLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forbidden" element={<ForbiddenPage />} />
              <Route path="/*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Theme>
    </UserProvider>    
  );
  
}

export default withToastProvider(App);
