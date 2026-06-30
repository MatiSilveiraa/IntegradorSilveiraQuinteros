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

        public List<GrupoEntrenadorVO> ObtenerGruposPorEntrenador(int entrenadorId)
        {
            var hoy = DateTime.Today.DayOfWeek switch
            {
                DayOfWeek.Monday => DiaSemana.Lunes,
                DayOfWeek.Tuesday => DiaSemana.Martes,
                DayOfWeek.Wednesday => DiaSemana.Miercoles,
                DayOfWeek.Thursday => DiaSemana.Jueves,
                DayOfWeek.Friday => DiaSemana.Viernes,
                DayOfWeek.Saturday => DiaSemana.Sabado,
                DayOfWeek.Sunday => DiaSemana.Domingo,
                _ => DiaSemana.Lunes
            };

            var grupos = _context.Grupos
                .AsNoTracking()
                .Include(g => g.Clases)
                    .ThenInclude(c => c.Inscripciones)
                .Where(g => g.EntrenadorId == entrenadorId)
                .ToList();

            var resultado = grupos
                .Select(g =>
                {
                    var proximaClase = g.Clases
                        .Where(c => c.Estado == EstadoClase.Programada)
                        .OrderBy(c => c.DiaSemana == hoy ? 0 : 1)
                        .ThenBy(c => c.HoraInicio)
                        .FirstOrDefault();

                    return new GrupoEntrenadorVO
                    {
                        Id = g.Id,

                        Nombre = g.Nombre,

                        Nivel = g.Nivel,

                        Estado = g.Estado.ToString(),

                        CantidadClases = g.Clases.Count,

                        CantidadAlumnos = g.Clases
                            .SelectMany(c => c.Inscripciones)
                            .Select(i => i.AlumnoId)
                            .Distinct()
                            .Count(),

                        ProximoDia = proximaClase?.DiaSemana.ToString(),

                        ProximaHoraInicio = proximaClase?.HoraInicio,

                        ProximaHoraFin = proximaClase?.HoraFin,

                        ClaseId = proximaClase?.Id ?? 0,

                        CupoMaximo = proximaClase?.CupoMaximo ?? 0,

                        Inscriptos = proximaClase?.Inscripciones.Count ?? 0,

                        CuposDisponibles = proximaClase == null
                            ? 0
                            : proximaClase.CupoMaximo - proximaClase.Inscripciones.Count
                    };
                })
                .OrderBy(g => g.Nombre)
                .ToList();

            return resultado;
        }

        public GrupoDetalleVO? ObtenerDetalleGrupo(
    int grupoId,
    int entrenadorId)
        {
            var grupo = _context.Grupos

                .AsNoTracking()

                .Include(g => g.Clases)
                    .ThenInclude(c => c.Inscripciones)
                        .ThenInclude(i => i.Alumno)

                .FirstOrDefault(g =>
                    g.Id == grupoId &&
                    g.EntrenadorId == entrenadorId);

            if (grupo == null)
            {
                return null;
            }

            return new GrupoDetalleVO
            {
                Id = grupo.Id,

                Nombre = grupo.Nombre,

                Nivel = grupo.Nivel,

                Estado = grupo.Estado.ToString(),

                CantidadClases = grupo.Clases.Count,

                CantidadAlumnos = grupo.Clases
                    .SelectMany(c => c.Inscripciones)
                    .Select(i => i.AlumnoId)
                    .Distinct()
                    .Count(),

                Alumnos = grupo.Clases

                    .SelectMany(c => c.Inscripciones)

                    .GroupBy(i => i.AlumnoId)

                    .Select(g => g.First())

                    .OrderBy(i => i.Alumno.Nombre)

                    .Select(i => new AlumnoGrupoVO
                    {
                        Id = i.Alumno.UsuarioId,

                        Nombre = i.Alumno.Nombre.Valor,

                        Apellido = i.Alumno.Apellido.Valor,

                        Peso = i.Alumno.Peso,

                        Estatura = i.Alumno.Estatura,

                        IMC = i.Alumno.IMC,

                        Bloqueado =
                            i.Alumno.BloqueadoPorDeuda ||
                            i.Alumno.BloqueadoPorInasistencias
                    })

                    .ToList(),

                Clases = grupo.Clases

                    .OrderBy(c => c.DiaSemana)

                    .ThenBy(c => c.HoraInicio)

                    .Select(c => new ClaseGrupoVO
                    {
                        Id = c.Id,

                        DiaSemana = c.DiaSemana.ToString(),

                        HoraInicio = c.HoraInicio,

                        HoraFin = c.HoraFin,

                        CupoMaximo = c.CupoMaximo,

                        Inscriptos = c.Inscripciones.Count,

                        Activa = c.Estado == EstadoClase.Programada
                    })

                    .ToList()
            };
        }

    }
}
