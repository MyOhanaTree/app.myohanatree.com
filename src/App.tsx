import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

import Index from "./pages/Index";

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import Profile from "./pages/profile/View";

import PersonView from "./pages/person/View";
import PersonEdit from "./pages/person/Edit";
import PersonDocuments from "./pages/person/Documents";

import UserIndex from "./pages/users/Index";
import UserEdit from "./pages/users/Index";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
        <Route path="/person/:id" element={<PrivateRoute><PersonView /></PrivateRoute>} />
        <Route path="/person/:id/documents" element={<PrivateRoute><PersonDocuments /></PrivateRoute>} />
        <Route path="/person/:id/edit" element={<PrivateRoute><PersonEdit /></PrivateRoute>} />        
        <Route path="/users" element={<PrivateRoute><UserIndex /></PrivateRoute>} />
        <Route path="/users/:id" element={<PrivateRoute><UserEdit /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
