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

        public void Agregar(int alumnoId, int grupoId)
        {
            var existe = _context.Set<ListaEspera>()
                .Any(l => l.AlumnoId == alumnoId && l.GrupoId == grupoId);

            if (existe)
                return;

            var item = new ListaEspera
            {
                AlumnoId = alumnoId,
                GrupoId = grupoId,
                FechaSolicitud = DateTime.Now
            };

            _context.Set<ListaEspera>().Add(item);
            _context.SaveChanges();
        }

        public bool Existe(int alumnoId, int grupoId)
        {
            return _context.Set<ListaEspera>()
                .Any(l => l.AlumnoId == alumnoId && l.GrupoId == grupoId);
        }

        public IEnumerable<int> ObtenerAlumnosEnEspera(int grupoId)
        {
            return _context.Set<ListaEspera>()
                .Where(l => l.GrupoId == grupoId)
                .OrderBy(l => l.FechaSolicitud)
                .Select(l => l.AlumnoId)
                .ToList();
        }

        public void Remover(int alumnoId, int grupoId)
        {
            var item = _context.Set<ListaEspera>()
                .FirstOrDefault(l => l.AlumnoId == alumnoId && l.GrupoId == grupoId);

            if (item != null)
            {
                _context.Set<ListaEspera>().Remove(item);
                _context.SaveChanges();
            }
        }
    }
}