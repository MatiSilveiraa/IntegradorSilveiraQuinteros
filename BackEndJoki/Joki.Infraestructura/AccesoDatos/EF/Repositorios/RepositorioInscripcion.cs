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

        public bool Existe(int alumnoId, int grupoId)
        {
            return _context.Inscripciones
                .Any(i => i.AlumnoId == alumnoId && i.GrupoId == grupoId);
        }

        public int CantidadPorGrupo(int grupoId)
        {
            return _context.Inscripciones
                .Count(i => i.GrupoId == grupoId);
        }

        public IEnumerable<Inscripcion> ObtenerPorAlumno(int alumnoId)
        {
            return _context.Inscripciones
                .Include(i => i.Grupo)
                .Where(i => i.AlumnoId == alumnoId)
                .ToList();
        }

        public bool TieneSuperposicion(int alumnoId, Grupo grupo)
        {
            var inscripciones = _context.Inscripciones
                .Include(i => i.Grupo)
                .Where(i => i.AlumnoId == alumnoId)
                .ToList();

            return inscripciones.Any(i =>
                i.Grupo.DiaSemana == grupo.DiaSemana &&
                i.Grupo.HoraInicio == grupo.HoraInicio
            );
        }
    }
}  