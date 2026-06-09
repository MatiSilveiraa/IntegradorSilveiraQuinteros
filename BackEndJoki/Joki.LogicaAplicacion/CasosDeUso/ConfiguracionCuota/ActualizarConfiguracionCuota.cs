using Joki.CasoUsoCompartida.DTOs.ConfiguracionCuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.ConfiguracionCuota;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.CasosDeUso.ConfiguracionCuota
{
    public class ActualizarConfiguracionCuota :
        IActualizarConfiguracionCuota
    {
        private readonly IRepositorioConfiguracionCuota _repositorioConfiguracionCuota;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public ActualizarConfiguracionCuota(
            IRepositorioConfiguracionCuota repositorioConfiguracionCuota,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioConfiguracionCuota = repositorioConfiguracionCuota;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            ActualizarConfiguracionCuotaRequest request,
                int usuarioId)
        {
            if (request.MontoMensual <= 0)
            {
                throw new LogicaNegocioException(
                    "El monto mensual debe ser mayor a cero");
            }

            var configuracionActual =
                _repositorioConfiguracionCuota.ObtenerActiva();

            if (configuracionActual != null)
            {
                configuracionActual.Activa = false;

                _repositorioConfiguracionCuota.Modificar(
                    configuracionActual);
            }

            var nuevaConfiguracion =
                new Entidades.ConfiguracionCuota
                {
                    MontoMensual = request.MontoMensual,
                    FechaDesde = DateTime.UtcNow,
                    Activa = true
                };

            _repositorioConfiguracionCuota.Agregar(
                nuevaConfiguracion);

            decimal montoAnterior = 0;

            if (configuracionActual != null)
            {
                montoAnterior = configuracionActual.MontoMensual;
            }

            _repositorioAuditoria.Agregar(
                new Entidades.Auditoria
                {
                    UsuarioId = usuarioId,
                    Entidad = "ConfiguracionCuota",
                    EntidadId = nuevaConfiguracion.Id,
                    Accion =
                        $"Actualizó el monto mensual de cuota de {montoAnterior} a {request.MontoMensual}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}