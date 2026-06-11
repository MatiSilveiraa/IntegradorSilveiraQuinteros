using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Entidades = Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Pago
{
    public class RegistrarPago : IRegistrarPago
    {
        private readonly IRepositorioPago _repositorioPago;
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioNotificacion _repositorioNotificacion;

        public RegistrarPago(
            IRepositorioPago repositorioPago,
            IRepositorioCuota repositorioCuota,
            IRepositorioNotificacion repositorioNotificacion)
        {
            _repositorioPago = repositorioPago;
            _repositorioCuota = repositorioCuota;
            _repositorioNotificacion = repositorioNotificacion;
        }

        public void Ejecutar(RegistrarPagoRequest request)
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

            Entidades.Pago pago = new Entidades.Pago
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
        }
    }
}