using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioAsistencia : IRepositorioAsistencia
    {
        private readonly JokiContext _context;

        public RepositorioAsistencia(JokiContext context)
        {
            _context = context;
        }

        public void Agregar(Asistencia asistencia)
        {
            _context.Asistencias.Add(asistencia);

            _context.SaveChanges();
        }

        public bool ExisteAsistencia(int alumnoId, int claseId, DateTime fecha)
        {
            return _context.Asistencias.Any(a =>
                a.AlumnoId == alumnoId &&
                a.ClaseId == claseId &&
                a.Fecha.Date == fecha.Date);
        }
    }
}
