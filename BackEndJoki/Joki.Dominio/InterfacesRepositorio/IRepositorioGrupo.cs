using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioGrupo
    {
        Grupo Agregar(Grupo grupo);
        List<Grupo> ObtenerTodos();
        Grupo? ObtenerPorId(int id);
        void Actualizar(Grupo grupo);
        void Eliminar(int id);
    }
}
