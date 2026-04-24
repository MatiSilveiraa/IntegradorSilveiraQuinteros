
namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioUsuario
    {
        bool ExisteEmail(string email);
        Usuario? ObtenerPorEmail(string email);
        Usuario? ObtenerPorId(int id);
        void Modificar(Usuario usuario);
    }
}
