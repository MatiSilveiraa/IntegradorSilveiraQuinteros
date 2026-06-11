using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioNotificacion :
        IRepositorioNotificacion
    {
        private readonly JokiContext _context;

        public RepositorioNotificacion(JokiContext context)
        {
            _context = context;
        }



        public void Agregar(Notificacion notificacion)
        {
            _context.Notificaciones.Add(notificacion);
            _context.SaveChanges();
        }

        public void Modificar(Notificacion notificacion)
        {
            _context.Notificaciones.Update(notificacion);
            _context.SaveChanges();
        }

        public Notificacion? ObtenerPorId(int id)
        {
            return _context.Notificaciones
                .FirstOrDefault(n => n.Id == id);
        }

        public IEnumerable<Notificacion> ObtenerPorUsuario(int usuarioId)
        {
            return _context.Notificaciones
                .Where(n => n.UsuarioId == usuarioId)
                .OrderByDescending(n => n.FechaCreacion)
                .ToList();
        }

        public IEnumerable<Notificacion> ObtenerNoLeidasPorUsuario(int usuarioId)
        {
            return _context.Notificaciones
                .Where(n =>
                    n.UsuarioId == usuarioId &&
                    !n.Leida)
                .OrderByDescending(n => n.FechaCreacion)
                .ToList();
        }

        public bool Existe(
    int usuarioId,
    TipoNotificacion tipo,
    string entidadReferencia,
    int entidadReferenciaId)
        {
            return _context.Notificaciones.Any(n =>
                n.UsuarioId == usuarioId &&
                n.Tipo == tipo &&
                n.EntidadReferencia == entidadReferencia &&
                n.EntidadReferenciaId == entidadReferenciaId);
        }
    }
}