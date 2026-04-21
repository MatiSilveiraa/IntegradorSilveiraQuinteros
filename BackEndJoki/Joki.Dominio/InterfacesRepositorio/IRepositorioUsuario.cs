using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioUsuario
    {
        bool ExisteEmail(string email);
        Usuario? ObtenerPorEmail(string email);
    }
}
