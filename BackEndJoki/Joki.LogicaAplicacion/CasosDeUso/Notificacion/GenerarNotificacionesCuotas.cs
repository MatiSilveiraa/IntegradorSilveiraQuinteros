using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Notificacion
{
    public class GenerarNotificacionesCuotas
    {
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioNotificacion _repositorioNotificacion;

        public GenerarNotificacionesCuotas(
            IRepositorioCuota repositorioCuota,
            IRepositorioNotificacion repositorioNotificacion)
        {
            _repositorioCuota = repositorioCuota;
            _repositorioNotificacion = repositorioNotificacion;
        }

        public void Ejecutar()
        {
            DateTime hoy = DateTime.Today;

            var cuotasPorVencer =
                _repositorioCuota.ObtenerPendientesPorVencer(
                    hoy,
                    hoy.AddDays(3));

            foreach (var cuota in cuotasPorVencer)
            {
                bool existe =
                    _repositorioNotificacion.Existe(
                        cuota.AlumnoId,
                        TipoNotificacion.Vencimiento,
                        "Cuota",
                        cuota.Id);

                if (!existe)
                {
                    _repositorioNotificacion.Agregar(
                        new LogicaNegocio.Entidades.Notificacion
                        {
                            UsuarioId = cuota.AlumnoId,
                            Titulo = "Cuota por vencer",
                            Mensaje =
                                $"Tu cuota vence el {cuota.FechaVencimiento:dd/MM/yyyy}.",
                            Tipo = TipoNotificacion.Vencimiento,
                            UrlDestino = "/cuotas",
                            EntidadReferencia = "Cuota",
                            EntidadReferenciaId = cuota.Id
                        });
                }
            }

            var cuotasVencidas =
    _repositorioCuota.ObtenerPendientesVencidas(
        hoy);

            foreach (var cuota in cuotasVencidas)
            {
                bool existe =
                    _repositorioNotificacion.Existe(
                        cuota.AlumnoId,
                        TipoNotificacion.Deuda,
                        "Cuota",
                        cuota.Id);

                if (!existe)
                {
                    _repositorioNotificacion.Agregar(
                        new LogicaNegocio.Entidades.Notificacion
                        {
                            UsuarioId = cuota.AlumnoId,
                            Titulo = "Cuota vencida",
                            Mensaje =
                                "Tu cuota se encuentra vencida.",
                            Tipo = TipoNotificacion.Deuda,
                            UrlDestino = "/cuotas",
                            EntidadReferencia = "Cuota",
                            EntidadReferenciaId = cuota.Id
                        });
                }
            }
        }
    }
}