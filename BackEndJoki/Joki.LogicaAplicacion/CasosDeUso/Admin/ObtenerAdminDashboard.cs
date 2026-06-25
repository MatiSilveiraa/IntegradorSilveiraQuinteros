using System.Globalization;
using Joki.CasoUsoCompartida.DTOs.Admin;
using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Admin;
using Joki.LogicaNegocio.InterfacesRepositorio;


namespace Joki.LogicaAplicacion.CasosDeUso.Admin
{
    public class ObtenerAdminDashboard :
        IObtenerAdminDashboard
    {

        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioBeneficio _repositorioBeneficio;
        private readonly IRepositorioNotificacion _repositorioNotificacion;
        private readonly IRepositorioPago _repositorioPago;

        public ObtenerAdminDashboard(
            IRepositorioAlumno repositorioAlumno,
            IRepositorioDesafio repositorioDesafio,
            IRepositorioCuota repositorioCuota,
            IRepositorioBeneficio repositorioBeneficio,
            IRepositorioNotificacion repositorioNotificacion,
            IRepositorioPago repositorioPago)
        {
            _repositorioAlumno = repositorioAlumno;
            _repositorioDesafio = repositorioDesafio;
            _repositorioCuota = repositorioCuota;
            _repositorioBeneficio = repositorioBeneficio;
            _repositorioNotificacion = repositorioNotificacion;
            _repositorioPago = repositorioPago;
        }

        public AdminDashboardResponse Ejecutar()
        {
            DateTime hoy = DateTime.Today;

            var dashboard = new AdminDashboardResponse
            {
                AlumnosActivos =
                    _repositorioAlumno.ContarActivos(),

                DesafiosActivos =
                    _repositorioDesafio.ContarActivos(),

                CuotasPendientes =
                    _repositorioCuota.ContarPendientes(),

                CuotasVencidas =
                    _repositorioCuota.ContarVencidas(hoy),

                BeneficiosPendientes =
                    _repositorioBeneficio.ContarPendientes(),

                PremiosFisicosPendientes =
                    _repositorioBeneficio.ContarFisicosPendientes(),

                NotificacionesNoLeidas =
                    _repositorioNotificacion.ContarNoLeidas(),

                IngresosMesActual =
                    _repositorioPago.ObtenerIngresosDelMes(
                        hoy.Month,
                        hoy.Year)
            };

            dashboard.IngresosUltimos6Meses =
                _repositorioPago.ObtenerIngresosUltimos6Meses()
                .Select(i => new IngresoMensualDTO
                {
                    Mes = new CultureInfo("es-UY")
    .DateTimeFormat
    .GetAbbreviatedMonthName(i.Mes),

                    Total = i.Total
                })
                .ToList();

            return dashboard;
        }
    }
}