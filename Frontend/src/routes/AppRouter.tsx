import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import AdminDashboard from "../pages/Admin/AdminDashboard";
import AlumnoDashboard from "../pages/Alumno/AlumnoDashboard";
import EntrenadorDashboard from "../pages/entrenador/EntrenadorDashboard";

import PagosPage from "../pages/PagoPage";

import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import VerifyCodePage from "../pages/VerifyCodePage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import GruposPage from "../pages/GrupoPage";
import GrupoDetallePage from "../pages/GrupoDetallePage";
import PerfilPage from "../pages/PerfilPage";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/alumno" element={<AlumnoDashboard />} />

        <Route path="/alumno/pagos" element={<PagosPage />} />

        <Route
          path="/entrenador"
          element={<EntrenadorDashboard />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/verify-code"
          element={<VerifyCodePage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/alumno/grupos"
          element={<GruposPage />}
        />
        
        <Route
          path="/alumno/grupos/:grupoId"
          element={<GrupoDetallePage />}
        />

        <Route
          path="/alumno/perfil"
          element={<PerfilPage />}
        />

      </Routes>
    </BrowserRouter>
  );
}