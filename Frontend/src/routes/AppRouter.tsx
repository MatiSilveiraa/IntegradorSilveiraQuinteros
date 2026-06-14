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
// import AdminPremiosPage from "../pages/AdminPremiosPage";
import AdminPremiosPage from "../pages/AdminPremiosPage";
import SeguridadPage from "../pages/Shared/SeguridadPage";
import TwoFactorLoginPage from "./../pages/TwoFactorLoginPage";



export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/alumno" element={<AlumnoDashboard />} />

        <Route path="/alumno/pagos" element={<PagosPage />} />

        <Route path="/entrenador" element={<EntrenadorDashboard />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/verify-code" element={<VerifyCodePage />} />

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/alumno/grupos" element={<GruposPage />} />

        <Route path="/alumno/grupos/:grupoId" element={<GrupoDetallePage />} />

        <Route path="/alumno/perfil" element={<PerfilPage />} />

        <Route path="/alumno/notificaciones" element={<NotificacionPage />} />

        <Route path="/alumno/beneficios" element={<BeneficiosPage />} />

        <Route path="/alumno/desafios" element={<DesafiosPage />} />

        <Route path="/admin/desafios" element={<AdminDesafiosPage />} />

        <Route path="/admin/recompensas" element={<AdminRecompensasPage />} />

        {/* <Route
  path="/admin/premios"
  element={<AdminPremiosPage />}
/> */}
        <Route path="/admin/alumnos" element={<AdminAlumnosPage />} />

        <Route path="/admin/premios" element={<AdminPremiosPage />} />

        <Route path="/alumno/seguridad" element={<SeguridadPage />} />
        <Route path="/admin/seguridad" element={<SeguridadPage />} />

        <Route path="/2fa-login" element={<TwoFactorLoginPage />} />
<Route path="/alumno/seguridad" 
  element={<SeguridadPage />}
/>

      </Routes>
    </BrowserRouter>
  );
}
