using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class EliminarGrupo : IEliminarGrupo
    {
        private readonly IRepositorioGrupo _repositorioGrupo;

        public EliminarGrupo(IRepositorioGrupo repositorioGrupo)
        {
            _repositorioGrupo = repositorioGrupo;
        }

        public void Ejecutar(int id)
        {
            var grupo = _repositorioGrupo.ObtenerPorId(id);

            if (grupo == null)
            {
                throw new LogicaNegocioException("El grupo solicitado no existe.");
            }

            _repositorioGrupo.Eliminar(id);
        }
    }
}
