using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioClase : IRepositorioClase
    {
        private readonly JokiContext _context;

        public RepositorioClase(JokiContext context)
        {
            _context = context;
        }

        public Clase Agregar(Clase clase)
        {
            _context.Clases.Add(clase);

            _context.SaveChanges();

            return clase;
        }

        public void Actualizar(Clase clase)
        {
            _context.Clases.Update(clase);

            _context.SaveChanges();
        }

        public void Eliminar(int id)
        {
            var clase = ObtenerPorId(id);

            if (clase != null)
            {
                _context.Clases.Remove(clase);

                _context.SaveChanges();
            }
        }

        public Clase? ObtenerPorId(int id)
        {
            return _context.Clases
                .Include(c => c.Inscripciones)
                .Include(c => c.Asistencias)
                .Include(c => c.MaterialesEjercicio)
                .FirstOrDefault(c => c.Id == id);
        }

        public IEnumerable<Clase> ObtenerTodos()
        {
            return _context.Clases
                .Include(c => c.Inscripciones)
                .Include(c => c.Asistencias)
                .Include(c => c.MaterialesEjercicio)
                .ToList();
        }

        public bool Existe(int id)
        {
            return _context.Clases
                .Any(c => c.Id == id);
        }

        public bool TieneConflictoHorario(
            int alumnoId,
            Clase nuevaClase)
        {
            var clasesAlumno = _context.Inscripciones
                .Include(i => i.Clase)
                .Where(i => i.AlumnoId == alumnoId)
                .Select(i => i.Clase)
                .ToList();

            return clasesAlumno.Any(clase =>
                clase.TieneConflictoHorarioCon(nuevaClase));
        }
    }
}