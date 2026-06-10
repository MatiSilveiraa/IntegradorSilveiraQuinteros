using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioRecompensa :
        IRepositorioRecompensa
    {
        private readonly JokiContext _context;

        public RepositorioRecompensa(
            JokiContext context)
        {
            _context = context;
        }

        public void Agregar(Recompensa recompensa)
        {
            _context.Recompensas.Add(recompensa);
            _context.SaveChanges();
        }

        public void Modificar(Recompensa recompensa)
        {
            _context.Recompensas.Update(recompensa);
            _context.SaveChanges();
        }

        public Recompensa? ObtenerPorId(int id)
        {
            return _context.Recompensas
                .Include(r => r.Descuento)
                .FirstOrDefault(r => r.Id == id);
        }

        public IEnumerable<Recompensa> ObtenerTodas()
        {
            return _context.Recompensas
                .Include(r => r.Descuento)
                .ToList();
        }

        public IEnumerable<Recompensa> ObtenerPorDesafio(
    int desafioId)
        {
            return _context.Recompensas
                .Include(r => r.Descuento)
                .Where(r =>
                    r.DesafioId == desafioId &&
                    r.Activo)
                .ToList();
        }

        public IEnumerable<Recompensa> ObtenerActivasPorDesafio(
    int desafioId)
        {
            return _context.Recompensas
                .Include(r => r.Descuento)
                .Where(r =>
                    r.DesafioId == desafioId &&
                    r.Activo)
                .ToList();
        }
    }
}