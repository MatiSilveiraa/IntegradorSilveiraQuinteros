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

        public IEnumerable<Auditoria> ObtenerUltimas(int cantidad)
        {
            return _context.Auditorias
                .OrderByDescending(a => a.Fecha)
                .Take(cantidad)
                .ToList();
        }

        public void Agregar(
            Auditoria auditoria)
        {
            _context.Auditorias.Add(auditoria);

            _context.SaveChanges();
        }
    }
}