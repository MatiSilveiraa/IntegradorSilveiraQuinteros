using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioRecompensa
    {
        void Agregar(Recompensa recompensa);

        void Modificar(Recompensa recompensa);

        Recompensa? ObtenerPorId(int id);

        IEnumerable<Recompensa> ObtenerTodas();
        IEnumerable<Recompensa> ObtenerPorDesafio(int desafioId);
        IEnumerable<Recompensa> ObtenerActivasPorDesafio(int desafioId);
    }
}