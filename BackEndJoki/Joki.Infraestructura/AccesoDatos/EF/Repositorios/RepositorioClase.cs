using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

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
                .Include(c => c.Grupo)
                .Include(c => c.Inscripciones)
                .Include(c => c.Asistencias)
                .Include(c => c.MaterialesEjercicio)

                // NUEVO
                .Include(c => c.Entrenadores)
                    .ThenInclude(e => e.Entrenador)

                .FirstOrDefault(c => c.Id == id);
        }

        public IEnumerable<Clase> ObtenerTodos()
        {
            return _context.Clases
                .Include(c => c.Grupo)
                .Include(c => c.Inscripciones)
                .Include(c => c.Asistencias)
                .Include(c => c.MaterialesEjercicio)

                .Include(c => c.Entrenadores)
                    .ThenInclude(e => e.Entrenador)

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

            return new ClaseDetalleVO
            {
                Id = clase.Id,

                GrupoId = clase.GrupoId,

                Grupo = clase.Grupo.Nombre,

                DiaSemana = clase.DiaSemana.ToString(),

                HoraInicio = clase.HoraInicio,

                HoraFin = clase.HoraFin,

                CupoMaximo = clase.CupoMaximo,

                Inscriptos = clase.Inscripciones.Count,

                CuposDisponibles =
                    clase.CupoMaximo - clase.Inscripciones.Count,

                Latitud = clase.Ubicacion.Latitud,

                Longitud = clase.Ubicacion.Longitud,

                CodigoPostal = clase.Ubicacion.CodigoPostal,

                Radio = clase.RadioGeolocalizacion,

                Alumnos = clase.Inscripciones

                    .OrderBy(i => i.Alumno.Nombre)

                    .Select(i => new AlumnoClaseVO
                    {
                        Id = i.Alumno.UsuarioId,

                        Nombre = i.Alumno.Nombre.Valor,

                        Apellido = i.Alumno.Apellido.Valor,

                        Presente = clase.Asistencias.Any(a =>
                            a.AlumnoId == i.Alumno.UsuarioId &&
                            a.Presente == true)
                    })
                    .ToList()
            };
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