using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class EditarGrupo : IEditarGrupo
    {
        private readonly IRepositorioGrupo _repositorioGrupo;

        public EditarGrupo(IRepositorioGrupo repositorioGrupo)
        {
            _repositorioGrupo = repositorioGrupo;
        }

        public GrupoResponse Ejecutar(int id, EditarGrupoRequest request)
        {
            var grupo = _repositorioGrupo.ObtenerPorId(id);

            if (grupo == null)
            {
                throw new LogicaNegocioException("El grupo solicitado no existe.");
            }
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

            MapperGrupo.UpdateEntity(grupo, request);

            _repositorioGrupo.Actualizar(grupo);

            return MapperGrupo.ToResponse(grupo);
        }
    }
}
