using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
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
            if (clase == null)
            {
                throw new ArgumentNullException(
                    nameof(clase));
            }

    
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

        public List<Clase> ObtenerDisponiblesParaEntrenador(
            int entrenadorId)
        {
            DateTime hoyUruguay =
                ObtenerFechaHoraUruguay().Date;

            return _context.Clases
                .AsNoTracking()

                .Include(c => c.Grupo)

                .Include(c => c.Inscripciones)

                .Include(c => c.Entrenadores)

                .Where(c =>
                    c.Estado == EstadoClase.Programada &&
                    c.Grupo.Estado == EstadoGrupo.ACTIVO &&
                    c.FechaInicio.Date <= hoyUruguay &&
                    (
                        !c.FechaFin.HasValue ||
                        c.FechaFin.Value.Date >= hoyUruguay
                    ) &&
                    !c.Entrenadores.Any(e =>
                        e.EntrenadorId == entrenadorId))

                .OrderBy(c =>
                    c.DiaSemana)

                .ThenBy(c =>
                    c.HoraInicio)

                .ToList();
        }

        public Clase? ObtenerPorId(
          int id)
        {
            return _context.Clases
                .Include(c => c.Grupo)
                .Include(c => c.Inscripciones)
                .Include(c => c.Asistencias)
                .Include(c => c.MaterialesEjercicio)
                .Include(c => c.Entrenadores)
                    .ThenInclude(ce =>
                        ce.Entrenador)
                .AsSplitQuery()
                .FirstOrDefault(c =>
                    c.Id == id);
        }

        public IEnumerable<Clase> ObtenerTodos()
        {
            return _context.Clases
                .AsNoTracking()
                .Include(c => c.Grupo)
                .Include(c => c.Inscripciones)
                .Include(c => c.Asistencias)
                .Include(c => c.MaterialesEjercicio)
                .Include(c => c.Entrenadores)
                    .ThenInclude(ce =>
                        ce.Entrenador)
                .OrderBy(c =>
                    c.DiaSemana)
                .ThenBy(c =>
                    c.HoraInicio)
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

        public ClaseDetalleVO? ObtenerDetalleClase(
           int claseId,
           int entrenadorId)
        {
            DateTime hoyUruguay =
                ObtenerFechaHoraUruguay().Date;

            var clase = _context.Clases
                .AsNoTracking()
                .Include(c => c.Grupo)
                .Include(c => c.Inscripciones)
                    .ThenInclude(i => i.Alumno)
                .Include(c => c.Asistencias)
                .Include(c => c.MaterialesEjercicio)
                .Include(c => c.Entrenadores)
                .FirstOrDefault(c =>
                    c.Id == claseId &&
                    c.Entrenadores.Any(e =>
                        e.EntrenadorId == entrenadorId));

            if (clase == null)
            {
                return null;
            }

            int cantidadInscriptos =
                clase.Inscripciones.Count(i =>
                    i.Alumno != null);

            return new ClaseDetalleVO
            {
                Id = clase.Id,

                GrupoId = clase.GrupoId,

                Grupo = clase.Grupo?.Nombre
                    ?? string.Empty,

                DiaSemana =
                    clase.DiaSemana.ToString(),

                HoraInicio =
                    clase.HoraInicio,

                HoraFin =
                    clase.HoraFin,

                CupoMaximo =
                    clase.CupoMaximo,

                Inscriptos =
                    cantidadInscriptos,

                CuposDisponibles =
                    Math.Max(
                        0,
                        clase.CupoMaximo -
                        cantidadInscriptos),

                Latitud =
                    clase.Ubicacion.Latitud,

                Longitud =
                    clase.Ubicacion.Longitud,

                CodigoPostal =
                    clase.Ubicacion.CodigoPostal
                    ?? string.Empty,

                Radio =
                    clase.RadioGeolocalizacion,

                Alumnos = clase.Inscripciones
                    .Where(i => i.Alumno != null)
                    .OrderBy(i =>
                        i.Alumno.Nombre?.Valor
                        ?? string.Empty)
                    .ThenBy(i =>
                        i.Alumno.Apellido?.Valor
                        ?? string.Empty)
                    .Select(i => new AlumnoClaseVO
                    {
                        Id =
                            i.Alumno.UsuarioId,

                        Nombre =
                            i.Alumno.Nombre?.Valor
                            ?? string.Empty,

                        Apellido =
                            i.Alumno.Apellido?.Valor
                            ?? string.Empty,

                        Presente = clase.Asistencias.Any(a =>
                            a.AlumnoId ==
                                i.Alumno.UsuarioId &&
                            a.Presente &&
                            a.Fecha.Date ==
                                hoyUruguay)
                    })
                    .ToList()
            };
        }


        private static DateTime ObtenerFechaHoraUruguay()
        {
            TimeZoneInfo zonaUruguay;

            try
            {
                zonaUruguay =
                    TimeZoneInfo.FindSystemTimeZoneById(
                        "Montevideo Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
                zonaUruguay =
                    TimeZoneInfo.FindSystemTimeZoneById(
                        "America/Montevideo");
            }

            return TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.UtcNow,
                zonaUruguay);
        }


        public List<ClaseDetalleVO> ObtenerClasesPorEntrenador(int entrenadorId)
        {
            return _context.Clases

                .AsNoTracking()

                .Include(c => c.Grupo)

                .Include(c => c.Inscripciones)

                .Include(c => c.Entrenadores)

                .Where(c =>
                c.Entrenadores.Any(e =>
                 e.EntrenadorId == entrenadorId))

                .Select(c => new ClaseDetalleVO
                {
                    Id = c.Id,

                    GrupoId = c.GrupoId,

                    Grupo = c.Grupo.Nombre,

                    DiaSemana = c.DiaSemana.ToString(),

                    HoraInicio = c.HoraInicio,

                    HoraFin = c.HoraFin,

                    CupoMaximo = c.CupoMaximo,

                    Inscriptos = c.Inscripciones.Count,

                    CuposDisponibles =
                        c.CupoMaximo - c.Inscripciones.Count,

                    Latitud = c.Ubicacion.Latitud,

                    Longitud = c.Ubicacion.Longitud,

                    CodigoPostal = c.Ubicacion.CodigoPostal,

                    Radio = c.RadioGeolocalizacion
                })

                .ToList();
        }
    }




}