using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Entidades = Joki.LogicaNegocio.Entidades;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Pago
{
    public class RegistrarPago : IRegistrarPago
    {
        private readonly IRepositorioPago _repositorioPago;
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioNotificacion _repositorioNotificacion;
        private readonly IActualizarBloqueoDeudaAlumno _actualizarBloqueoDeudaAlumno;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public RegistrarPago(
            IRepositorioPago repositorioPago,
            IRepositorioCuota repositorioCuota,
            IRepositorioNotificacion repositorioNotificacion,
            IActualizarBloqueoDeudaAlumno actualizarBloqueoDeudaAlumno,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioPago = repositorioPago;
            _repositorioCuota = repositorioCuota;
            _repositorioNotificacion = repositorioNotificacion;
            _actualizarBloqueoDeudaAlumno = actualizarBloqueoDeudaAlumno;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            RegistrarPagoRequest request,
            int usuarioId)
        {
            var cuota =
                _repositorioCuota.ObtenerPorId(request.CuotaId);

            if (cuota == null)
            {
                throw new LogicaNegocioException(
                    "Cuota no encontrada");
            }

            if (cuota.Estado == EstadoCuota.PAGADA)
            {
                throw new LogicaNegocioException(
                    "La cuota ya se encuentra pagada");
            }

            Entidades.Pago pago =
                new Entidades.Pago
                {
                    CuotaId = cuota.Id,
                    MedioPago = request.MedioPago,
                    FechaPago = DateTime.UtcNow,
                    Monto = cuota.MontoFinal,
                    Estado = EstadoPago.APROBADO,
                    ReferenciaExterna = request.ReferenciaExterna
                };

            _repositorioPago.Agregar(pago);

            cuota.Estado = EstadoCuota.PAGADA;

            _repositorioCuota.Modificar(cuota);

            _actualizarBloqueoDeudaAlumno.Ejecutar(
                cuota.AlumnoId);

            _repositorioNotificacion.Agregar(
                new Entidades.Notificacion
                {
                    UsuarioId = cuota.AlumnoId,
                    Titulo = "Pago registrado",
                    Mensaje =
                        $"Tu pago de la cuota {cuota.Mes}/{cuota.Anio} fue registrado correctamente.",
                    Tipo = TipoNotificacion.Pago,
                    UrlDestino = "/cuotas",
                    EntidadReferencia = "Pago",
                    EntidadReferenciaId = pago.Id
                });

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Pago",
                    EntidadId = pago.Id,
                    Accion =
                        $"Registró pago manual para cuota Id {cuota.Id} por monto {cuota.MontoFinal}. Medio: {request.MedioPago}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}