using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class CrearClase : ICrearClase
    {
        private readonly IRepositorioClase _repositorioClase;

        private readonly IRepositorioGrupo _repositorioGrupo;

        public CrearClase(
            IRepositorioClase repositorioClase,
            IRepositorioGrupo repositorioGrupo)
        {
            _repositorioClase = repositorioClase;

            _repositorioGrupo = repositorioGrupo;
        }

        public ClaseResponse Ejecutar(
            CrearClaseRequest request)
        {
            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Los datos de la clase no pueden ser nulos");
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

            var clase =
                MapperClase.ToEntity(request);

            var claseCreada =
                _repositorioClase.Agregar(clase);

            return MapperClase.ToResponse(
                claseCreada);
        }
    }
}