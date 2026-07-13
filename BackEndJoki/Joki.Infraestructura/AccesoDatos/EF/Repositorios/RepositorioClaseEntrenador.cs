using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioClaseEntrenador : IRepositorioClaseEntrenador
    {
        private readonly JokiContext _context;

        public RepositorioClaseEntrenador(JokiContext context)
        {
            _context = context;
        }

        public ClaseEntrenador Agregar(ClaseEntrenador claseEntrenador)
        {
            _context.ClaseEntrenadores.Add(claseEntrenador);

            _context.SaveChanges();

            return claseEntrenador;
        }

        public void AgregarVarios(IEnumerable<ClaseEntrenador> entrenadores)
        {
            _context.ClaseEntrenadores.AddRange(entrenadores);

            _context.SaveChanges();
        }

        public bool Existe(int claseId, int entrenadorId)
        {
            return _context.ClaseEntrenadores.Any(x =>
                x.ClaseId == claseId &&
                x.EntrenadorId == entrenadorId);
        }

        public ClaseEntrenador? Obtener(int claseId, int entrenadorId)
        {
            return _context.ClaseEntrenadores
                .Include(x => x.Entrenador)
                .Include(x => x.Clase)
                .FirstOrDefault(x =>
                    x.ClaseId == claseId &&
                    x.EntrenadorId == entrenadorId);
        }

        public IEnumerable<ClaseEntrenador> ObtenerPorClase(int claseId)
        {
            return _context.ClaseEntrenadores
                .Include(x => x.Entrenador)
                .Where(x => x.ClaseId == claseId)
                .ToList();
        }

        public IEnumerable<ClaseEntrenador> ObtenerPorEntrenador(int entrenadorId)
        {
            return _context.ClaseEntrenadores
                .Include(x => x.Clase)
                .Where(x => x.EntrenadorId == entrenadorId)
                .ToList();
        }

        public void Eliminar(int claseId, int entrenadorId)
        {
            var entidad = Obtener(claseId, entrenadorId);

            if (entidad == null)
            {
                return;
            }

            _context.ClaseEntrenadores.Remove(entidad);

            _context.SaveChanges();
        }

        public void EliminarPorClase(int claseId)
        {
            var relaciones = _context.ClaseEntrenadores
                .Where(x => x.ClaseId == claseId)
                .ToList();

            if (!relaciones.Any())
                return;

            _context.ClaseEntrenadores.RemoveRange(relaciones);

            _context.SaveChanges();
        }
    }
}