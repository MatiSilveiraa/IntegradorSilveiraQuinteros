using Joki.CasoUsoCompartida.DTOs.Descuento;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Descuento
{
    public class ActualizarDescuento :
        IActualizarDescuento
    {
        private readonly IRepositorioDescuento _repositorioDescuento;
        private readonly IRepositorioBeneficio _repositorioBeneficio;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public ActualizarDescuento(
            IRepositorioDescuento repositorioDescuento,
            IRepositorioBeneficio repositorioBeneficio,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioDescuento = repositorioDescuento;
            _repositorioBeneficio = repositorioBeneficio;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            int id,
            ActualizarDescuentoRequest request,
            int usuarioId)
        {
            var descuento =
                _repositorioDescuento.ObtenerPorId(id);

            if (descuento == null)
            {
                throw new LogicaNegocioException(
                    "No existe el descuento");
            }

            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                throw new LogicaNegocioException(
                    "El nombre es obligatorio");
            }

            if (request.Porcentaje <= 0 ||
                request.Porcentaje > 100)
            {
                throw new LogicaNegocioException(
                    "El porcentaje debe estar entre 1 y 100");
            }

            if (request.MesesDuracion <= 0)
            {
                throw new LogicaNegocioException(
                    "La duración debe ser mayor a cero");
            }

            decimal porcentajeAnterior =
                descuento.Porcentaje;

            bool activoAnterior =
                descuento.Activo;

            string nombreAnterior =
                descuento.Nombre;

            descuento.Nombre = request.Nombre;
            descuento.Descripcion = request.Descripcion;
            descuento.Porcentaje = request.Porcentaje;
            descuento.MesesDuracion = request.MesesDuracion;
            descuento.Activo = request.Activo;

            _repositorioDescuento.Modificar(
                descuento);

            if (activoAnterior && !request.Activo)
            {
                var beneficiosPendientes =
                    _repositorioBeneficio
                        .ObtenerPendientesPorDescuento(id);

                foreach (var beneficio in beneficiosPendientes)
                {
                    beneficio.Estado =
                        EstadoBeneficio.CANCELADO;

                    _repositorioBeneficio.Modificar(
                        beneficio);
                }
            }

            _repositorioAuditoria.Agregar(
                new Auditoria
                {
                    UsuarioId = usuarioId,
                    Entidad = "Descuento",
                    EntidadId = descuento.Id,
                    Accion =
    $"Actualizó descuento Id {descuento.Id}. Porcentaje {porcentajeAnterior}->{request.Porcentaje}. Activo {activoAnterior}->{request.Activo}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}