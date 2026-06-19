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
import NotificacionPage from "../pages/NotificacionPage";
import BeneficiosPage from "../pages/BeneficiosPage";
import DesafiosPage from "../pages/DesafioPage";

import AdminDesafiosPage from "../pages/AdminDesafiosPage";
import AdminRecompensasPage from "../pages/AdminRecompensasPage";
import AdminAlumnosPage from "../pages/AdminAlumnosPage";
import AdminPremiosPage from "../pages/AdminPremiosPage";

import SeguridadPage from "../pages/Shared/SeguridadPage";
import TwoFactorLoginPage from "../pages/TwoFactorLoginPage";

import AsistenciasPage from "../pages/Alumno/AsistenciasPage";
import CompletarPerfilPage from "../pages/CompletarPerfilPage";

import ProtectedRoute from "./ProtectedRoutes";
import AdminReactivacionesPage from "../pages/AdminReactivacionesPage";
import SolicitarReactivacionPage from "../pages/SolicitarReactivacionPage";
import PasswordlessLoginPage from "../pages/PasswordlessLoginPage";
import PasswordlessCodePage from "../pages/PasswordlessCodePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}

        <Route path="/" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/verify-code" element={<VerifyCodePage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/2fa-login" element={<TwoFactorLoginPage />} />

        <Route path="/completar-perfil" element={<CompletarPerfilPage />} />

        {/* Alumno */}

        {/* Alumno */}

        <Route
          path="/alumno"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <AlumnoDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/perfil"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <PerfilPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/notificaciones"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <NotificacionPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/asistencias"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <AsistenciasPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/seguridad"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <SeguridadPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/reactivacion"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <SolicitarReactivacionPage />
            </ProtectedRoute>
          }
        />

        {/* RUTAS BLOQUEADAS SI EL ALUMNO ESTÁ BLOQUEADO */}

        <Route
          path="/alumno/pagos"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <PagosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/grupos"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <GruposPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/grupos/:grupoId"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <GrupoDetallePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/beneficios"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <BeneficiosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alumno/desafios"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <DesafiosPage />
            </ProtectedRoute>
          }
        />

        {/* Admin */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute rolPermitido="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/desafios"
          element={
            <ProtectedRoute rolPermitido="Admin">
              <AdminDesafiosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/recompensas"
          element={
            <ProtectedRoute rolPermitido="Admin">
              <AdminRecompensasPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/alumnos"
          element={
            <ProtectedRoute rolPermitido="Admin">
              <AdminAlumnosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/premios"
          element={
            <ProtectedRoute rolPermitido="Admin">
              <AdminPremiosPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/seguridad"
          element={
            <ProtectedRoute rolPermitido="Admin">
              <SeguridadPage />
            </ProtectedRoute>
          }
        />

        {/* Entrenador */}

        <Route
          path="/entrenador"
          element={
            <ProtectedRoute rolPermitido="Entrenador">
              <EntrenadorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reactivaciones"
          element={<AdminReactivacionesPage />}
        />

        <Route
          path="/alumno/reactivacion"
          element={
            <ProtectedRoute rolPermitido="Alumno">
              <SolicitarReactivacionPage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/passwordless-login"
  element={<PasswordlessLoginPage />}
/>

<Route
  path="/otp-login-codigo"
  element={<PasswordlessCodePage />}
/>
      </Routes>
    </BrowserRouter>
  );
}
