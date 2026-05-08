using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class EditarClase : IEditarClase
    {
        private readonly IRepositorioClase _repositorioClase;

        private readonly IRepositorioGrupo _repositorioGrupo;

        public EditarClase(
            IRepositorioClase repositorioClase,
            IRepositorioGrupo repositorioGrupo)
        {
            _repositorioClase = repositorioClase;

            _repositorioGrupo = repositorioGrupo;
        }

        public ClaseResponse Ejecutar(
            int id,
            EditarClaseRequest request)
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

            MapperClase.UpdateEntity(
                clase,
                request);

            _repositorioClase.Actualizar(clase);

            return MapperClase.ToResponse(clase);
        }
    }
}