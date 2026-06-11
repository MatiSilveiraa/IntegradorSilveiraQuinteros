using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;


namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioDesafio :
    IRepositorioDesafio
    {
        private readonly JokiContext _context;

        public RepositorioDesafio(
            JokiContext context)
        {
            _context = context;
        }

        public int ContarActivos()
        {
            return _context.Desafios
                .Count(d => d.Activo);
        }
        public void Agregar(Desafio desafio)
        {
            _context.Desafios.Add(desafio);
            _context.SaveChanges();
        }

        public void Modificar(Desafio desafio)
        {
            _context.Desafios.Update(desafio);
            _context.SaveChanges();
        }

        public Desafio? ObtenerPorId(int id)
        {
            return _context.Desafios
                .FirstOrDefault(d => d.Id == id);
        }

        public IEnumerable<Desafio> ObtenerTodos()
        {
            return _context.Desafios
                .ToList();
        }

        public IEnumerable<Desafio> ObtenerActivos()
        {
            return _context.Desafios
                .Where(d => d.Activo)
                .ToList();
        }
    }
}
