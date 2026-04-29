using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class ObtenerGrupos : IObtenerGrupos
    {
        private readonly IRepositorioGrupo _repositorioGrupo;

        public ObtenerGrupos(IRepositorioGrupo repositorioGrupo)
        {
            _repositorioGrupo = repositorioGrupo;
        }

        public IEnumerable<GrupoResponse> Ejecutar()
        {
            var grupos = _repositorioGrupo.ObtenerTodos();

            List<GrupoResponse> response = new List<GrupoResponse>();

            foreach (var grupo in grupos)
            {
                response.Add(MapperGrupo.ToResponse(grupo));
            }

            return response;
        }
    }
}
