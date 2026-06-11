namespace Joki.CasoUsoCompartida.DTOs.Admin
{
    public class AdminDashboardResponse
    {
        public int AlumnosActivos { get; set; }

        public int DesafiosActivos { get; set; }

        public int CuotasPendientes { get; set; }

        public int CuotasVencidas { get; set; }

        public int BeneficiosPendientes { get; set; }

        public int PremiosFisicosPendientes { get; set; }

        public int NotificacionesNoLeidas { get; set; }

        public decimal IngresosMesActual { get; set; }
    }
}