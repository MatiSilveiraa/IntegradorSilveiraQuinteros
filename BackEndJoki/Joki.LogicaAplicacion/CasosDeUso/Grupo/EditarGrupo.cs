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

            MapperGrupo.UpdateEntity(grupo, request);

            _repositorioGrupo.Actualizar(grupo);

            return MapperGrupo.ToResponse(grupo);
        }
    }
}
