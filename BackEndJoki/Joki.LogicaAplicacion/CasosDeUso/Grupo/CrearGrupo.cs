using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
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
            var grupo = MapperGrupo.ToEntity(request);
            var grupoCreado = _repositorioGrupo.Agregar(grupo);

            return MapperGrupo.ToResponse(grupoCreado);
        }
    }
}
