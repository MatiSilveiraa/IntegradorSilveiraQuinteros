using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioAuditoria :
        IRepositorioAuditoria
    {
        private readonly JokiContext _context;

        public RepositorioAuditoria(
            JokiContext context)
        {
            _context = context;
        }

        public void Agregar(
            Auditoria auditoria)
        {
            _context.Auditorias.Add(auditoria);

            _context.SaveChanges();
        }

        public IEnumerable<Auditoria> ObtenerUltimas(
            int cantidad)
        {
            return _context.Auditorias
                .OrderByDescending(a => a.Fecha)
                .Take(cantidad)
                .ToList();
        }

        public IEnumerable<Auditoria> ObtenerPorUsuario(
            int usuarioId,
            int cantidad)
        {
            return _context.Auditorias
                .Where(a => a.UsuarioId == usuarioId)
                .OrderByDescending(a => a.Fecha)
                .Take(cantidad)
                .ToList();
        }

        public IEnumerable<Auditoria> ObtenerPorEntidad(
            string entidad,
            int cantidad)
        {
            return _context.Auditorias
                .Where(a => a.Entidad == entidad)
                .OrderByDescending(a => a.Fecha)
                .Take(cantidad)
                .ToList();
        }
    }
}