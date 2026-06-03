import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";

import RegisterPage from "../pages/RegisterPage";

import AdminDashboard from "../pages/Admin/AdminDashboard";

import AlumnoDashboard from "../components/navigation/AlumnoDashboard";

import EntrenadorDashboard from "../pages/entrenador/EntrenadorDashboard";

export default function AppRouter() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LoginPage />}
        />

         <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/alumno"
          element={<AlumnoDashboard />}
        />

        <Route
          path="/entrenador"
          element={<EntrenadorDashboard />}
        />

      </Routes>

    </BrowserRouter>
  );
}