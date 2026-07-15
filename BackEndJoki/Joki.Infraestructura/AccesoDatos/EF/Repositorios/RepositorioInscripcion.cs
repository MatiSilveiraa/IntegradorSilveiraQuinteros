using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioInscripcion : IRepositorioInscripcion
    {
        private readonly JokiContext _context;

        public RepositorioInscripcion(JokiContext context)
        {
            _context = context;
        }

        public void Agregar(Inscripcion inscripcion)
        {
            _context.Inscripciones.Add(inscripcion);

            _context.SaveChanges();
        }

        public void Remover(int alumnoId, int claseId)
        {
            var inscripcion = _context.Inscripciones
                .FirstOrDefault(i =>
                    i.AlumnoId == alumnoId &&
                    i.ClaseId == claseId);

            if (inscripcion != null)
            {
                _context.Inscripciones.Remove(inscripcion);

                _context.SaveChanges();
            }
        }

        public bool Existe(int alumnoId, int claseId)
        {
            return _context.Inscripciones
                .Any(i =>
                    i.AlumnoId == alumnoId &&
                    i.ClaseId == claseId);
        }

        public int CantidadPorClase(int claseId)
        {
            return _context.Inscripciones
                .Count(i => i.ClaseId == claseId);
        }

        public IEnumerable<Inscripcion> ObtenerPorAlumno(int alumnoId)
        {
            return _context.Inscripciones
                .Include(i => i.Clase)
                .ThenInclude(c => c.Grupo)

                .Include(i => i.Clase)
                .ThenInclude(c => c.Entrenadores)
                .ThenInclude(ce => ce.Entrenador)

                .Include(i => i.Clase)
                .ThenInclude(c => c.Asistencias)

                .Where(i => i.AlumnoId == alumnoId)
                .ToList();
        }

        public IEnumerable<Inscripcion> ObtenerPorClase(int claseId)
        {
            return _context.Inscripciones
                .Include(i => i.Alumno)
                .Where(i => i.ClaseId == claseId)
                .ToList();
        }
    }
}