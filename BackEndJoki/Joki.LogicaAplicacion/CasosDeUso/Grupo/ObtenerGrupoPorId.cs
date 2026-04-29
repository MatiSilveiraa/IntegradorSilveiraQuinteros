using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class ObtenerGrupoPorId : IObtenerGrupoPorId
    {
        private readonly IRepositorioGrupo _repositorioGrupo;

        public ObtenerGrupoPorId(IRepositorioGrupo repositorioGrupo)
        {
            _repositorioGrupo = repositorioGrupo;
        }

        public GrupoResponse Ejecutar(int id)
        {
            var grupo = _repositorioGrupo.ObtenerPorId(id);

            if (grupo == null)
            {
                throw new LogicaNegocioException("El grupo solicitado no existe.");
            }

            return MapperGrupo.ToResponse(grupo);
        }
    }
}
