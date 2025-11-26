import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import FamilyTree from "./pages/FamilyTree";
import PersonPage from "./pages/PersonPage";

import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />        
        <Route path="/" element={<PrivateRoute><FamilyTree /></PrivateRoute>}/>
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>}/>
        <Route path="/person/:id" element={<PrivateRoute><PersonPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
