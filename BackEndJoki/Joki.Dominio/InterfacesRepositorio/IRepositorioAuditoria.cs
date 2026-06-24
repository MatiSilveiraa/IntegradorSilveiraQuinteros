using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioAuditoria
    {
        void Agregar(Auditoria auditoria);

        IEnumerable<Auditoria> ObtenerUltimas(int cantidad);

        IEnumerable<Auditoria> ObtenerPorUsuario(
            int usuarioId,
            int cantidad);

        IEnumerable<Auditoria> ObtenerPorEntidad(
            string entidad,
            int cantidad);
    }
}