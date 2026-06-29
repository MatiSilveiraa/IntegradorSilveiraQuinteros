using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioGrupo : IRepositorioGrupo
    {
        private readonly JokiContext _context;

        public RepositorioGrupo(JokiContext context)
        {
            _context = context;
        }

        public Grupo Agregar(Grupo grupo)
        {
            _context.Grupos.Add(grupo);
            _context.SaveChanges();
            return grupo;
        }

        public List<Grupo> ObtenerTodos()
        {
            return _context.Grupos
                .Include(g => g.Clases)
                .ThenInclude(c => c.Inscripciones)
                .ToList();
        }

        public Grupo? ObtenerPorId(int id)
        {
            return _context.Grupos
                .Include(g => g.Clases)
                .FirstOrDefault(g => g.Id == id);
        }

        public void Actualizar(Grupo grupo)
        {
            _context.Grupos.Update(grupo);
            _context.SaveChanges();
        }

        public void Eliminar(int id)
        {
            var grupo = ObtenerPorId(id);

            if (grupo != null)
            {
                _context.Grupos.Remove(grupo);
                _context.SaveChanges();
            }
        }
        public int ContarPorEntrenador(int entrenadorId)
        {
            return _context.Grupos
                .Count(g => g.EntrenadorId == entrenadorId);
        }

        public int ContarAlumnosPorEntrenador(int entrenadorId)
        {
            var inscripciones = _context.Inscripciones
                .Include(i => i.Clase)
                    .ThenInclude(c => c.Grupo)
                .ToList();

            return inscripciones
                .Where(i => i.Clase.Grupo.EntrenadorId == entrenadorId)
                .Select(i => i.AlumnoId)
                .Distinct()
                .Count();
        }
        public List<AgendaClaseVO> ObtenerAgendaHoy(int entrenadorId)
        {
            var hoy = DateTime.Today;

            var diaSemana = hoy.DayOfWeek switch
            {
                DayOfWeek.Monday => DiaSemana.Lunes,
                DayOfWeek.Tuesday => DiaSemana.Martes,
                DayOfWeek.Wednesday => DiaSemana.Miercoles,
                DayOfWeek.Thursday => DiaSemana.Jueves,
                DayOfWeek.Friday => DiaSemana.Viernes,
                DayOfWeek.Saturday => DiaSemana.Sabado,
                DayOfWeek.Sunday => DiaSemana.Domingo,
                _ => throw new Exception()
            };

            return _context.Clases
    .AsNoTracking()
    .Include(c => c.Grupo)
    .Include(c => c.Inscripciones)
        .ThenInclude(i => i.Alumno)

               .Where(c =>
                        c.Grupo.EntrenadorId == entrenadorId &&
                        c.DiaSemana == diaSemana &&
                        c.Estado == EstadoClase.Programada)

                .OrderBy(c => c.HoraInicio)

                .Select(c => new AgendaClaseVO
                {
                    ClaseId = c.Id,

                    GrupoId = c.GrupoId,

                    Grupo = c.Grupo.Nombre,

                    HoraInicio = c.HoraInicio,

                    HoraFin = c.HoraFin,

                    CantidadAlumnos = c.Inscripciones.Count,

                    CupoMaximo = c.CupoMaximo,

                    CuposDisponibles = c.CupoMaximo - c.Inscripciones.Count,

                    Alumnos = c.Inscripciones
        .Select(i => new AlumnoAgendaVO
        {
            Id = i.Alumno.UsuarioId,
            Nombre = i.Alumno.Nombre.Valor,
            Apellido = i.Alumno.Apellido.Valor
        })
        .Take(5)
        .ToList()
                })
                .ToList();
        }

        public ProximaClaseVO? ObtenerProximaClase(int entrenadorId)
        {
            var hoy = DateTime.Today;

            var ahora = DateTime.Now.TimeOfDay;

            var diaSemana = hoy.DayOfWeek switch
            {
                DayOfWeek.Monday => DiaSemana.Lunes,
                DayOfWeek.Tuesday => DiaSemana.Martes,
                DayOfWeek.Wednesday => DiaSemana.Miercoles,
                DayOfWeek.Thursday => DiaSemana.Jueves,
                DayOfWeek.Friday => DiaSemana.Viernes,
                DayOfWeek.Saturday => DiaSemana.Sabado,
                DayOfWeek.Sunday => DiaSemana.Domingo,
                _ => throw new Exception()
            };

            return _context.Clases
                .AsNoTracking()
                .Include(c => c.Grupo)
                .Include(c => c.Inscripciones)
                .Where(c =>
                    c.Grupo.EntrenadorId == entrenadorId &&
                    c.Estado == EstadoClase.Programada &&
                    c.DiaSemana == diaSemana &&
                    c.HoraInicio >= ahora)
                .OrderBy(c => c.HoraInicio)
                .Select(c => new ProximaClaseVO
                {
                    ClaseId = c.Id,
                    Grupo = c.Grupo.Nombre,
                    HoraInicio = c.HoraInicio,
                    HoraFin = c.HoraFin,
                    CantidadAlumnos = c.Inscripciones.Count
                })
                .FirstOrDefault();
        }

    }
}
