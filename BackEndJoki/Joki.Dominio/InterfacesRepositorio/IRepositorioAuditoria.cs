using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioAuditoria
    {
        void Agregar(Auditoria auditoria);
    }
}