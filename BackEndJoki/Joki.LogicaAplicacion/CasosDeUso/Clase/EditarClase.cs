using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class EditarClase : IEditarClase
    {
        private readonly IRepositorioClase _repositorioClase;
        private readonly IRepositorioGrupo _repositorioGrupo;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public EditarClase(
            IRepositorioClase repositorioClase,
            IRepositorioGrupo repositorioGrupo,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioClase = repositorioClase;
            _repositorioGrupo = repositorioGrupo;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public ClaseResponse Ejecutar(
            int id,
            EditarClaseRequest request,
            int usuarioId)
        {
            var clase =
                _repositorioClase.ObtenerPorId(id);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Los datos no pueden ser nulos");
            }

            var grupo =
                _repositorioGrupo.ObtenerPorId(
                    request.GrupoId);

            if (grupo == null)
            {
                throw new LogicaNegocioException(
                    "El grupo no existe");
            }

            if (grupo.Estado != EstadoGrupo.ACTIVO)
            {
                throw new LogicaNegocioException(
                    "El grupo no está disponible");
            }

            if (request.HoraFin <= request.HoraInicio)
            {
                throw new LogicaNegocioException(
                    "La hora de fin debe ser posterior a la hora de inicio");
            }

            if (request.CupoMaximo <= 0)
            {
                throw new LogicaNegocioException(
                    "El cupo máximo debe ser mayor a cero");
            }

            if (request.FechaFin.HasValue &&
                request.FechaFin < request.FechaInicio)
            {
                throw new LogicaNegocioException(
                    "La fecha de fin no puede ser anterior a la fecha de inicio");
            }

            var diaAnterior =
                clase.DiaSemana;

            var horaInicioAnterior =
                clase.HoraInicio;

            var horaFinAnterior =
                clase.HoraFin;

            MapperClase.UpdateEntity(
                clase,
                request);

            _repositorioClase.Actualizar(clase);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Clase",
                    EntidadId = clase.Id,
                    Accion =
                        $"Editó clase Id {clase.Id}. Antes: {diaAnterior} {horaInicioAnterior}-{horaFinAnterior}. Ahora: {clase.DiaSemana} {clase.HoraInicio}-{clase.HoraFin}",
                    Fecha = DateTime.UtcNow
                });

            return MapperClase.ToResponse(clase);
        }
    }
}