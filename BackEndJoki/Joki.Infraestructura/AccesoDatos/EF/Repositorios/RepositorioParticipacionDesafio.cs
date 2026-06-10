using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioParticipacionDesafio :
        IRepositorioParticipacionDesafio
    {
        private readonly JokiContext _context;

        public RepositorioParticipacionDesafio(
            JokiContext context)
        {
            _context = context;
        }

        public void Agregar(
            ParticipacionDesafio participacion)
        {
            _context.ParticipacionesDesafio.Add(participacion);

            _context.SaveChanges();
        }

        public void Modificar(
            ParticipacionDesafio participacion)
        {
            _context.ParticipacionesDesafio.Update(participacion);

            _context.SaveChanges();
        }

        public ParticipacionDesafio? Obtener(
            int alumnoId,
            int desafioId)
        {
            return _context.ParticipacionesDesafio
                .FirstOrDefault(p =>
                    p.AlumnoId == alumnoId &&
                    p.DesafioId == desafioId);
        }

        public IEnumerable<ParticipacionDesafio> ObtenerGanadoresPorDesafio(
    int desafioId)
        {
            return _context.ParticipacionesDesafio
                .Include(p => p.Alumno)
                .Where(p =>
                    p.DesafioId == desafioId &&
                    p.Ganador)
                .ToList();
        }

        public IEnumerable<ParticipacionDesafio> ObtenerParticipantesPorDesafio(
    int desafioId)
        {
            return _context.ParticipacionesDesafio
                .Include(p => p.Alumno)
                .Where(p => p.DesafioId == desafioId)
                .ToList();
        }

        public IEnumerable<ParticipacionDesafio> ObtenerPorAlumno(
    int alumnoId)
        {
            return _context.ParticipacionesDesafio
                .Where(p => p.AlumnoId == alumnoId)
                .ToList();
        }
    }
}