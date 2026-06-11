using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioNotificacion
    {
        void Agregar(Notificacion notificacion);

        void Modificar(Notificacion notificacion);

        Notificacion? ObtenerPorId(int id);
        int ContarNoLeidas();

        IEnumerable<Notificacion> ObtenerPorUsuario(int usuarioId);

        IEnumerable<Notificacion> ObtenerNoLeidasPorUsuario(int usuarioId);

        bool Existe(
            int usuarioId,
            TipoNotificacion tipo,
            string entidadReferencia,
            int entidadReferenciaId);
    }
}