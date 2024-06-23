import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import HomePage from "./components/homePage/HomePage";
import ProfilePage from "./components/profilePage/ProfilePage";
import LoginPage from "./components/loginPage/loginPage/LoginPage";
import AdminManagementPage from "./components/AdminPage/AdminManagementPage";

function App() {
  const isAuth = Boolean(useSelector((state) => state.token));
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token); // Ottieni il token dallo stato

  useEffect(() => {
    // Configura Axios per includere automaticamente il token in ogni richiesta
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }, [token]);

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/" />} />
          <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/admin" element={isAuth && user?.role === 'admin' ? <AdminManagementPage /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
