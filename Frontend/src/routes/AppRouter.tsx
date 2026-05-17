import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LoginPage from "../pages/LoginPage";

import AdminDashboard from "../pages/Admin/AdminDashboard";

import AlumnoDashboard from "../pages/Alumno/AlumnoDashboard";

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