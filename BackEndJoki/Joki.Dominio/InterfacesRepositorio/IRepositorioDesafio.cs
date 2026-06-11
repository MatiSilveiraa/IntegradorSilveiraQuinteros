using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioDesafio
    {
        void Agregar(Desafio desafio);

        void Modificar(Desafio desafio);

        Desafio? ObtenerPorId(int id);
        int ContarActivos();

        IEnumerable<Desafio> ObtenerTodos();
        IEnumerable<Desafio> ObtenerActivos();
    }
}