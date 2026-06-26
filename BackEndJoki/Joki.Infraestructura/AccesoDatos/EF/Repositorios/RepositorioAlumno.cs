using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioAlumno : IRepositorioAlumno
    {
        private readonly JokiContext _contexto;

        public RepositorioAlumno(JokiContext contexto)
        {
            _contexto = contexto;
        }

        public int Agregar(Alumno alumno)
        {
            if (alumno == null)
            {
                throw new ArgumentNullException(nameof(alumno));
            }

            _contexto.Alumnos.Add(alumno);
            _contexto.SaveChanges();
            return alumno.UsuarioId;
        }

        public int ContarActivos()
        {
            return _contexto.Alumnos
                .Count(a => a.Estado == EstadoUsuario.ACTIVO);
        }

        public IEnumerable<Alumno> ObtenerTodos()
        {
            return _contexto.Set<Alumno>()
        .Include(a => a.Cuotas)
        .ToList();
        }

        public Alumno? ObtenerPorId(int id)
        {
            return _contexto.Set<Alumno>()
                .Include(a => a.Inscripciones)
                .Include(a => a.Cuotas)
                .FirstOrDefault(a => a.UsuarioId == id);
        }
        public void Modificar(Alumno alumno)
        {
            if (alumno == null)
            {
                throw new ArgumentNullException(nameof(alumno));
            }
            _contexto.Set<Alumno>().Update(alumno);
            _contexto.SaveChanges();
        }

        public IEnumerable<Alumno> ObtenerActivos()
        {
            return _contexto.Set<Alumno>()
                .Where(a => a.Estado == EstadoUsuario.ACTIVO)
                .ToList();
        }
    }
}
