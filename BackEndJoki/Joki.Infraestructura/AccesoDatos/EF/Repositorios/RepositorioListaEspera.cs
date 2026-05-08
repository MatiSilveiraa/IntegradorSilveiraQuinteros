using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioListaEspera : IRepositorioListaEspera
    {
        private readonly JokiContext _context;

        public RepositorioListaEspera(JokiContext context)
        {
            _context = context;
        }

        public void Agregar(int alumnoId, int claseId)
        {
            var existe = _context.Set<ListaEspera>()
                .Any(l =>
                    l.AlumnoId == alumnoId &&
                    l.ClaseId == claseId);

            if (existe)
            {
                return;
            }

            var item = new ListaEspera
            {
                AlumnoId = alumnoId,
                ClaseId = claseId,
                FechaSolicitud = DateTime.UtcNow
            };

            _context.Set<ListaEspera>().Add(item);

            _context.SaveChanges();
        }

        public bool Existe(int alumnoId, int claseId)
        {
            return _context.Set<ListaEspera>()
                .Any(l =>
                    l.AlumnoId == alumnoId &&
                    l.ClaseId == claseId);
        }

        public IEnumerable<int> ObtenerAlumnosEnEspera(int claseId)
        {
            return _context.Set<ListaEspera>()
                .Where(l => l.ClaseId == claseId)
                .OrderBy(l => l.FechaSolicitud)
                .Select(l => l.AlumnoId)
                .ToList();
        }

        public void Remover(int alumnoId, int claseId)
        {
            var item = _context.Set<ListaEspera>()
                .FirstOrDefault(l =>
                    l.AlumnoId == alumnoId &&
                    l.ClaseId == claseId);

            if (item != null)
            {
                _context.Set<ListaEspera>().Remove(item);

                _context.SaveChanges();
            }
        }
    }
}