using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioDescuento
    {
        void Agregar(Descuento descuento);

        void Modificar(Descuento descuento);

        Descuento? ObtenerPorId(int id);

        IEnumerable<Descuento> ObtenerTodos();

        IEnumerable<Descuento> ObtenerActivos();
    }
}
