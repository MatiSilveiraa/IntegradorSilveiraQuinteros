using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class CrearGrupo : ICrearGrupo
    {
        private readonly IRepositorioGrupo _repositorioGrupo;

        public CrearGrupo(IRepositorioGrupo repositorioGrupo)
        {
            _repositorioGrupo = repositorioGrupo;
        }

        public GrupoResponse Ejecutar(CrearGrupoRequest request)
        {
            if (request == null)
            {
                throw new LogicaNegocioException("Los datos del grupo no pueden ser nulos.");
            }

            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                throw new LogicaNegocioException("El nombre del grupo es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(request.Nivel))
            {
                throw new LogicaNegocioException("El nivel del grupo es obligatorio.");
            }

            if (request.CupoMaximo <= 0)
            {
                throw new LogicaNegocioException("El cupo máximo debe ser mayor a cero.");
            }

            if (request.HoraFin <= request.HoraInicio)
            {
                throw new LogicaNegocioException("La hora de fin debe ser posterior a la hora de inicio.");
            }

            var grupo = MapperGrupo.ToEntity(request);
            var grupoCreado = _repositorioGrupo.Agregar(grupo);

            return MapperGrupo.ToResponse(grupoCreado);
        }
    }
}
