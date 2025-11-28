import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import FamilyTree from "./pages/FamilyTree";
import PersonPage from "./pages/PersonPage";
import UserManagement from "./pages/UserManagement";
import UserEdit from "./pages/UserEdit";

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<PrivateRoute><FamilyTree /></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
        <Route path="/person/:id" element={<PrivateRoute><PersonPage /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
        <Route path="/users/:id" element={<PrivateRoute><UserEdit /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
