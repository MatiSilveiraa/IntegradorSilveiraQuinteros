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
    }
}