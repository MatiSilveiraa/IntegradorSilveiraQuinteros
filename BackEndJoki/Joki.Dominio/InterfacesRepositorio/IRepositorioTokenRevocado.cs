using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioTokenRevocado
    {
        void Agregar(TokenRevocado token);
        bool Existe(string token);
    }
}
