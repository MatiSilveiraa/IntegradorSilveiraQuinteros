using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioDesafio
    {
        void Agregar(Desafio desafio);

        void Modificar(Desafio desafio);

        Desafio? ObtenerPorId(int id);

        IEnumerable<Desafio> ObtenerTodos();
        IEnumerable<Desafio> ObtenerActivos();
    }
}