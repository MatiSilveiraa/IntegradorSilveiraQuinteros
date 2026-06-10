using Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Recompensa
{
    public class EliminarRecompensa : IEliminarRecompensa
    {
        private readonly IRepositorioRecompensa _repositorioRecompensa;

        public EliminarRecompensa(
            IRepositorioRecompensa repositorioRecompensa)
        {
            _repositorioRecompensa = repositorioRecompensa;
        }

        public void Ejecutar(int id)
        {
            var recompensa =
                _repositorioRecompensa.ObtenerPorId(id);

            if (recompensa == null || !recompensa.Activo)
            {
                throw new LogicaNegocioException("No existe la recompensa");
            }

            recompensa.Activo = false;

            _repositorioRecompensa.Modificar(recompensa);
        }
    }
}