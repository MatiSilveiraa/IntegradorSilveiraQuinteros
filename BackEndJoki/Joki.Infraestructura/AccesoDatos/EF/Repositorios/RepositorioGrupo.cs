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

        public RepositorioGrupo(
            JokiContext context)
        {
            _context = context;
        }

        public Grupo Agregar(
            Grupo grupo)
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

        public Grupo? ObtenerPorId(
            int id)
        {
            return _context.Grupos
                .Include(g => g.Clases)
                    .ThenInclude(c => c.Inscripciones)
                .FirstOrDefault(g => g.Id == id);
        }

        public void Actualizar(
            Grupo grupo)
        {
            _context.Grupos.Update(grupo);
            _context.SaveChanges();
        }

        public void Eliminar(
            int id)
        {
            var grupo =
                ObtenerPorId(id);

            if (grupo == null)
            {
                return;
            }

            _context.Grupos.Remove(grupo);
            _context.SaveChanges();
        }

        public int ContarPorEntrenador(
            int entrenadorId)
        {
            return _context.Grupos
    .Count(g =>
        g.Clases.Any(c =>
            c.Entrenadores.Any(e =>
                e.EntrenadorId == entrenadorId)));
        }

        public int ContarAlumnosPorEntrenador(
            int entrenadorId)
        {
            return _context.Inscripciones
                .AsNoTracking()
              .Where(i =>
    i.Clase.Entrenadores.Any(e =>
        e.EntrenadorId == entrenadorId))
                .Select(i => i.AlumnoId)
                .Distinct()
                .Count();
        }

        public List<AgendaClaseVO> ObtenerAgendaHoy(
            int entrenadorId)
        {
            return ObtenerAgenda(
                entrenadorId,
                ObtenerFechaHoraUruguay().Date);
        }

        public List<AgendaClaseVO> ObtenerAgenda(
            int entrenadorId,
            DateTime fecha)
        {
            DateTime fechaOcurrencia = fecha.Date;

            DiaSemana diaSemana =
                ConvertirDiaSemana(
                    fechaOcurrencia.DayOfWeek);

            var clases =
                _context.Clases
                    .AsNoTracking()
                    .Include(c => c.Grupo)
                    .Include(c => c.Inscripciones)
                        .ThenInclude(i => i.Alumno)
                    .Include(c => c.Asistencias)
                    .Include(c => c.Entrenadores)
                    .Where(c =>
                        c.Entrenadores.Any(e =>
                            e.EntrenadorId == entrenadorId) &&
                        c.Grupo.Estado == EstadoGrupo.ACTIVO &&
                        c.Estado == EstadoClase.Programada &&
                        c.DiaSemana == diaSemana)
                    .ToList();

            return clases
                .Where(c =>
                    ClaseVigenteEnFecha(
                        c,
                        fechaOcurrencia))
                .OrderBy(c => c.HoraInicio)
                .Select(c =>
                {
                    var alumnosInscriptos = c.Inscripciones
                        .Select(i => i.AlumnoId)
                        .Distinct()
                        .ToHashSet();

                    var asistenciasOcurrencia = c.Asistencias
                        .Where(a =>
                            a.Fecha.Date == fechaOcurrencia &&
                            alumnosInscriptos.Contains(a.AlumnoId))
                        .GroupBy(a => a.AlumnoId)
                        .Select(g => g
                            .OrderByDescending(a => a.FechaRegistro)
                            .First())
                        .ToList();

                    int cantidadAlumnos =
                        alumnosInscriptos.Count;

                    int presentes =
                        asistenciasOcurrencia.Count(a => a.Presente);

                    int ausentes =
                        asistenciasOcurrencia.Count(a => !a.Presente);

                    int sinRegistrar =
                        Math.Max(
                            0,
                            cantidadAlumnos -
                            presentes -
                            ausentes);

                    string estadoAsistencia =
                        cantidadAlumnos == 0
                            ? "Sin alumnos"
                            : presentes + ausentes == 0
                                ? "Sin registrar"
                                : sinRegistrar == 0
                                    ? "Completa"
                                    : "Parcial";

                    return new AgendaClaseVO
                    {
                        ClaseId = c.Id,

                        GrupoId = c.GrupoId,

                        FechaOcurrencia =
                            fechaOcurrencia,

                        Grupo = c.Grupo.Nombre,

                        HoraInicio = c.HoraInicio,

                        HoraFin = c.HoraFin,

                        CantidadAlumnos =
                            cantidadAlumnos,

                        CupoMaximo =
                            c.CupoMaximo,

                        CuposDisponibles =
                            Math.Max(
                                0,
                                c.CupoMaximo -
                                cantidadAlumnos),

                        Presentes = presentes,

                        Ausentes = ausentes,

                        SinRegistrar = sinRegistrar,

                        EstadoAsistencia =
                            estadoAsistencia,

                        Alumnos = c.Inscripciones
                            .GroupBy(i => i.AlumnoId)
                            .Select(g => g.First())
                            .OrderBy(i =>
                                i.Alumno.Nombre.Valor)
                            .ThenBy(i =>
                                i.Alumno.Apellido.Valor)
                            .Select(i =>
                                new AlumnoAgendaVO
                                {
                                    Id =
                                        i.Alumno.UsuarioId,

                                    Nombre =
                                        i.Alumno.Nombre.Valor,

                                    Apellido =
                                        i.Alumno.Apellido.Valor
                                })
                            .Take(5)
                            .ToList()
                    };
                })
                .ToList();
        }

        public ProximaClaseVO? ObtenerProximaClase(
        int entrenadorId)
        {
            DateTime ahoraUruguay =
                ObtenerFechaHoraUruguay();

            var clases =
                _context.Clases
                    .AsNoTracking()
                    .Include(c => c.Grupo)
                    .Include(c => c.Inscripciones)
                    .Include(c => c.Entrenadores)
                   .Where(c =>
                            c.Entrenadores.Any(e =>
                            e.EntrenadorId == entrenadorId) &&
                            c.Grupo.Estado == EstadoGrupo.ACTIVO &&
                            c.Estado == EstadoClase.Programada)
                    .ToList();

            Console.WriteLine(
                $"[PROXIMA_CLASE] Entrenador={entrenadorId} " +
                $"AhoraUruguay={ahoraUruguay:yyyy-MM-dd HH:mm:ss} " +
                $"ClasesFiltradas={clases.Count}");

            foreach (var clase in clases)
            {
                DateTime? ocurrencia =
                    CalcularProximaOcurrencia(
                        clase,
                        ahoraUruguay);

                Console.WriteLine(
                    $"[PROXIMA_CLASE] " +
                    $"ClaseId={clase.Id}, " +
                    $"GrupoId={clase.GrupoId}, " +
                    $"Dia={clase.DiaSemana}, " +
                    $"Hora={clase.HoraInicio}, " +
                    $"Inicio={clase.FechaInicio:yyyy-MM-dd HH:mm:ss}, " +
                    $"Fin={(clase.FechaFin.HasValue ? clase.FechaFin.Value.ToString("yyyy-MM-dd HH:mm:ss") : "NULL")}, " +
                    $"Ocurrencia={(ocurrencia.HasValue ? ocurrencia.Value.ToString("yyyy-MM-dd HH:mm:ss") : "NULL")}");
            }

            return CalcularProximaClase(
                clases,
                ahoraUruguay);
        }

        public List<GrupoEntrenadorVO>
            ObtenerGruposPorEntrenador(
                int entrenadorId)
        {
            DateTime ahoraUruguay =
                ObtenerFechaHoraUruguay();

            var grupos =
                _context.Grupos
                    .AsNoTracking()
                    .Include(g => g.Clases)
                        .ThenInclude(c =>
                            c.Inscripciones)
                        .Include(g => g.Clases)
    .ThenInclude(c => c.Entrenadores)
                   .Where(g =>
    g.Clases.Any(c =>
        c.Entrenadores.Any(e =>
            e.EntrenadorId == entrenadorId)))
                    .ToList();

            return grupos
                .Select(grupo =>
                {
                    var clasesEntrenador = grupo.Clases
    .Where(c =>
        c.Entrenadores.Any(e =>
            e.EntrenadorId == entrenadorId))
    .ToList();
                    ProximaClaseVO? proximaClase =
                       CalcularProximaClase(
    clasesEntrenador,
    ahoraUruguay);

                    int cantidadAlumnos =
                        grupo.Clases
                            .SelectMany(c =>
                                c.Inscripciones)
                            .Select(i =>
                                i.AlumnoId)
                            .Distinct()
                            .Count();

                    return new GrupoEntrenadorVO
                    {
                        Id = grupo.Id,

                        Nombre = grupo.Nombre,

                        Nivel = grupo.Nivel,

                        Estado =
                            grupo.Estado.ToString(),

                        CantidadClases =
                            clasesEntrenador.Count,

                        CantidadAlumnos =
                            cantidadAlumnos,

                        ClaseId =
                            proximaClase?.ClaseId,

                        ProximoDia =
                            proximaClase?.DiaSemana,

                        ProximaHoraInicio =
                            proximaClase?.HoraInicio,

                        ProximaHoraFin =
                            proximaClase?.HoraFin,

                        FechaProximaClase =
                            proximaClase
                                ?.FechaProximaClase,

                        CupoMaximo =
                            proximaClase?.CupoMaximo,

                        Inscriptos =
                            proximaClase
                                ?.CantidadAlumnos,

                        CuposDisponibles =
                            proximaClase
                                ?.CuposDisponibles
                    };
                })
                .OrderBy(g => g.Nombre)
                .ToList();
        }

        public GrupoDetalleVO? ObtenerDetalleGrupo(
            int grupoId,
            int entrenadorId)
        {
            var grupo =
                _context.Grupos
                    .AsNoTracking()
                   .Include(g => g.Clases)
    .ThenInclude(c => c.Inscripciones)
        .ThenInclude(i => i.Alumno)

.Include(g => g.Clases)
    .ThenInclude(c => c.Entrenadores)
                    .FirstOrDefault(g =>
    g.Id == grupoId &&
    g.Clases.Any(c =>
        c.Entrenadores.Any(e =>
            e.EntrenadorId == entrenadorId)));

            if (grupo == null)
            {
                return null;
            }
            var clasesEntrenador = grupo.Clases
    .Where(c =>
        c.Entrenadores.Any(e =>
            e.EntrenadorId == entrenadorId))
    .ToList();
            return new GrupoDetalleVO
            {
                Id = grupo.Id,

                Nombre = grupo.Nombre,

                Nivel = grupo.Nivel,

                Estado =
                    grupo.Estado.ToString(),

                CantidadClases =
    clasesEntrenador.Count,

                CantidadAlumnos =
    clasesEntrenador
                        .SelectMany(c =>
                            c.Inscripciones)
                        .Select(i =>
                            i.AlumnoId)
                        .Distinct()
                        .Count(),
                Alumnos =
    clasesEntrenador
                        .SelectMany(c =>
                            c.Inscripciones)
                        .GroupBy(i =>
                            i.AlumnoId)
                        .Select(g =>
                            g.First())
                        .OrderBy(i =>
                            i.Alumno.Nombre.Valor)
                        .Select(i =>
                            new AlumnoGrupoVO
                            {
                                Id =
                                    i.Alumno.UsuarioId,

                                Nombre =
                                    i.Alumno.Nombre.Valor,

                                Apellido =
                                    i.Alumno.Apellido.Valor,

                                Peso =
                                    i.Alumno.Peso,

                                Estatura =
                                    i.Alumno.Estatura,

                                IMC =
                                    i.Alumno.IMC,

                                Bloqueado =
                                    i.Alumno
                                        .BloqueadoPorDeuda ||
                                    i.Alumno
                                        .BloqueadoPorInasistencias
                            })
                        .ToList(),

                Clases =
    clasesEntrenador
                        .OrderBy(c =>
                            ObtenerOrdenDia(
                                c.DiaSemana))
                        .ThenBy(c =>
                            c.HoraInicio)
                        .Select(c =>
                            new ClaseGrupoVO
                            {
                                Id = c.Id,

                                DiaSemana =
                                    c.DiaSemana
                                        .ToString(),

                                HoraInicio =
                                    c.HoraInicio,

                                HoraFin =
                                    c.HoraFin,

                                CupoMaximo =
                                    c.CupoMaximo,

                                Inscriptos =
                                    c.Inscripciones
                                        .Count,

                                Activa =
                                    c.Estado ==
                                    EstadoClase.Programada
                            })
                        .ToList()
            };
        }

        private static ProximaClaseVO?
            CalcularProximaClase(
                IEnumerable<Clase> clases,
                DateTime ahoraUruguay)
        {
            return clases
                .Where(c =>
                    c.Estado ==
                        EstadoClase.Programada &&
                    c.Grupo != null &&
                    c.Grupo.Estado ==
                        EstadoGrupo.ACTIVO)
                .Select(c => new
                {
                    Clase = c,

                    FechaOcurrencia =
                        CalcularProximaOcurrencia(
                            c,
                            ahoraUruguay)
                })
                .Where(x =>
                    x.FechaOcurrencia.HasValue)
                .OrderBy(x =>
                    x.FechaOcurrencia!.Value)
                .Select(x =>
                    new ProximaClaseVO
                    {
                        ClaseId =
                            x.Clase.Id,

                        GrupoId =
                            x.Clase.GrupoId,

                        Grupo =
                            x.Clase.Grupo.Nombre,

                        DiaSemana =
                            x.Clase.DiaSemana
                                .ToString(),

                        HoraInicio =
                            x.Clase.HoraInicio,

                        HoraFin =
                            x.Clase.HoraFin,

                        FechaProximaClase =
                            x.FechaOcurrencia!.Value,

                        CantidadAlumnos =
                            x.Clase.Inscripciones
                                .Count,

                        CupoMaximo =
                            x.Clase.CupoMaximo,

                        CuposDisponibles =
                            Math.Max(
                                0,
                                x.Clase.CupoMaximo -
                                x.Clase.Inscripciones
                                    .Count)
                    })
                .FirstOrDefault();
        }

        private static DateTime?
            CalcularProximaOcurrencia(
                Clase clase,
                DateTime ahoraUruguay)
        {
            DateTime fechaMinima =
                ahoraUruguay.Date;

            if (clase.FechaInicio.Date >
                fechaMinima)
            {
                fechaMinima =
                    clase.FechaInicio.Date;
            }

            DayOfWeek diaObjetivo =
                ConvertirADayOfWeek(
                    clase.DiaSemana);

            int diasHastaClase =
                ((int)diaObjetivo -
                 (int)fechaMinima.DayOfWeek + 7) % 7;

            DateTime fechaCandidata =
                fechaMinima.AddDays(
                    diasHastaClase);

            DateTime ocurrencia =
                fechaCandidata.Add(
                    clase.HoraInicio);

            if (ocurrencia <= ahoraUruguay)
            {
                ocurrencia =
                    ocurrencia.AddDays(7);
            }

            if (ocurrencia.Date <
                clase.FechaInicio.Date)
            {
                int diasAFechaInicio =
                    (int)Math.Ceiling(
                        (clase.FechaInicio.Date -
                         ocurrencia.Date)
                        .TotalDays / 7);

                ocurrencia =
                    ocurrencia.AddDays(
                        diasAFechaInicio * 7);
            }

            if (clase.FechaFin.HasValue &&
                ocurrencia.Date >
                    clase.FechaFin.Value.Date)
            {
                return null;
            }

            return DateTime.SpecifyKind(
                ocurrencia,
                DateTimeKind.Unspecified);
        }

        private static bool ClaseVigenteEnFecha(
            Clase clase,
            DateTime fecha)
        {
            if (fecha.Date <
                clase.FechaInicio.Date)
            {
                return false;
            }

            if (clase.FechaFin.HasValue &&
                fecha.Date >
                    clase.FechaFin.Value.Date)
            {
                return false;
            }

            return true;
        }

        private static DateTime
            ObtenerFechaHoraUruguay()
        {
            TimeZoneInfo zonaUruguay;

            try
            {
                zonaUruguay =
                    TimeZoneInfo
                        .FindSystemTimeZoneById(
                            "Montevideo Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
                zonaUruguay =
                    TimeZoneInfo
                        .FindSystemTimeZoneById(
                            "America/Montevideo");
            }

            return TimeZoneInfo
                .ConvertTimeFromUtc(
                    DateTime.UtcNow,
                    zonaUruguay);
        }

        private static DiaSemana
            ConvertirDiaSemana(
                DayOfWeek dia)
        {
            return dia switch
            {
                DayOfWeek.Monday =>
                    DiaSemana.Lunes,

                DayOfWeek.Tuesday =>
                    DiaSemana.Martes,

                DayOfWeek.Wednesday =>
                    DiaSemana.Miercoles,

                DayOfWeek.Thursday =>
                    DiaSemana.Jueves,

                DayOfWeek.Friday =>
                    DiaSemana.Viernes,

                DayOfWeek.Saturday =>
                    DiaSemana.Sabado,

                DayOfWeek.Sunday =>
                    DiaSemana.Domingo,

                _ => throw new InvalidOperationException(
                    "Día de la semana inválido")
            };
        }

        private static DayOfWeek
            ConvertirADayOfWeek(
                DiaSemana dia)
        {
            return dia switch
            {
                DiaSemana.Lunes =>
                    DayOfWeek.Monday,

                DiaSemana.Martes =>
                    DayOfWeek.Tuesday,

                DiaSemana.Miercoles =>
                    DayOfWeek.Wednesday,

                DiaSemana.Jueves =>
                    DayOfWeek.Thursday,

                DiaSemana.Viernes =>
                    DayOfWeek.Friday,

                DiaSemana.Sabado =>
                    DayOfWeek.Saturday,

                DiaSemana.Domingo =>
                    DayOfWeek.Sunday,

                _ => throw new InvalidOperationException(
                    "Día de la semana inválido")
            };
        }

        private static int ObtenerOrdenDia(
            DiaSemana dia)
        {
            return dia switch
            {
                DiaSemana.Lunes => 1,
                DiaSemana.Martes => 2,
                DiaSemana.Miercoles => 3,
                DiaSemana.Jueves => 4,
                DiaSemana.Viernes => 5,
                DiaSemana.Sabado => 6,
                DiaSemana.Domingo => 7,
                _ => 8
            };
        }
    }
}