using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioEntrenador
    {
        IEnumerable<Entrenador> ObtenerActivos();
    }
}