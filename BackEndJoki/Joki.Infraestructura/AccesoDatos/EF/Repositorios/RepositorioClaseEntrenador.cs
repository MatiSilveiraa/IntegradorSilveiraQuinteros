using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioClaseEntrenador :
        IRepositorioClaseEntrenador
    {
        private readonly JokiContext _context;

        public RepositorioClaseEntrenador(
            JokiContext context)
        {
            _context = context;
        }

        public void Agregar(
            ClaseEntrenador relacion)
        {
            _context.Set<ClaseEntrenador>()
                .Add(relacion);

            _context.SaveChanges();
        }

        public void AgregarVarios(
            IEnumerable<ClaseEntrenador> relaciones)
        {
            var lista = relaciones.ToList();

            if (!lista.Any())
            {
                return;
            }

            _context.Set<ClaseEntrenador>()
                .AddRange(lista);

            _context.SaveChanges();
        }

        public void Modificar(
            ClaseEntrenador relacion)
        {
            _context.Set<ClaseEntrenador>()
                .Update(relacion);

            _context.SaveChanges();
        }

        public void Eliminar(
            ClaseEntrenador relacion)
        {
            _context.Set<ClaseEntrenador>()
                .Remove(relacion);

            _context.SaveChanges();
        }

        public void EliminarPorClase(
            int claseId)
        {
            var relaciones =
                _context.Set<ClaseEntrenador>()
                    .Where(x =>
                        x.ClaseId == claseId)
                    .ToList();

            if (!relaciones.Any())
            {
                return;
            }

            _context.Set<ClaseEntrenador>()
                .RemoveRange(relaciones);

            _context.SaveChanges();
        }

        public ClaseEntrenador? Obtener(
            int claseId,
            int entrenadorId)
        {
            return _context.Set<ClaseEntrenador>()
                .Include(x => x.Entrenador)
                .FirstOrDefault(x =>
                    x.ClaseId == claseId &&
                    x.EntrenadorId == entrenadorId);
        }

        public List<ClaseEntrenador> ObtenerPorClase(
            int claseId)
        {
            return _context.Set<ClaseEntrenador>()
                .Include(x => x.Entrenador)
                .Where(x =>
                    x.ClaseId == claseId)
                .OrderByDescending(x =>
                    x.EsPrincipal)
                .ThenBy(x =>
                    x.FechaAsignacion)
                .ToList();
        }

        public List<ConflictoEntrenadorVO> ObtenerConflictos(
            IEnumerable<int> entrenadoresIds,
            DiaSemana diaSemana,
            TimeSpan horaInicio,
            TimeSpan horaFin,
            DateTime fechaInicio,
            DateTime? fechaFin,
            int? claseExcluirId = null)
        {
            var ids = entrenadoresIds
                .Distinct()
                .ToList();

            if (!ids.Any())
            {
                return new List<ConflictoEntrenadorVO>();
            }

            var relaciones =
                _context.Set<ClaseEntrenador>()
                    .AsNoTracking()
                    .Include(x => x.Entrenador)
                    .Include(x => x.Clase)
                        .ThenInclude(c => c.Grupo)
                    .Where(x =>
                        ids.Contains(x.EntrenadorId) &&
                        x.Clase.Estado ==
                            EstadoClase.Programada &&
                        x.Clase.DiaSemana ==
                            diaSemana &&
                        x.Clase.HoraInicio <
                            horaFin &&
                        x.Clase.HoraFin >
                            horaInicio &&
                        (!claseExcluirId.HasValue ||
                         x.ClaseId !=
                            claseExcluirId.Value))
                    .ToList();

            return relaciones
                .Where(x =>
                    RangosFechasSeSuperponen(
                        x.Clase.FechaInicio,
                        x.Clase.FechaFin,
                        fechaInicio,
                        fechaFin))
                .Select(x =>
                    new ConflictoEntrenadorVO
                    {
                        EntrenadorId =
                            x.EntrenadorId,

                        Entrenador =
                            $"{x.Entrenador.Nombre.Valor} " +
                            $"{x.Entrenador.Apellido.Valor}",

                        ClaseId =
                            x.ClaseId,

                        Grupo =
                            x.Clase.Grupo?.Nombre
                            ?? string.Empty,

                        DiaSemana =
                            x.Clase.DiaSemana
                                .ToString(),

                        HoraInicio =
                            x.Clase.HoraInicio,

                        HoraFin =
                            x.Clase.HoraFin
                    })
                .OrderBy(x =>
                    x.Entrenador)
                .ThenBy(x =>
                    x.HoraInicio)
                .ToList();
        }

        public List<ClaseEntrenador> ObtenerPorEntrenador(
    int entrenadorId)
        {
            return _context.Set<ClaseEntrenador>()
                .AsNoTracking()
                .Include(ce => ce.Clase)
                    .ThenInclude(c => c.Grupo)
                .Include(ce => ce.Clase)
                    .ThenInclude(c => c.Inscripciones)
                .Include(ce => ce.Clase)
                    .ThenInclude(c => c.Entrenadores)
                .Where(ce =>
                    ce.EntrenadorId == entrenadorId)
                .OrderBy(ce =>
                    ce.Clase.DiaSemana)
                .ThenBy(ce =>
                    ce.Clase.HoraInicio)
                .ToList();
        }

        private static bool RangosFechasSeSuperponen(
            DateTime inicioA,
            DateTime? finA,
            DateTime inicioB,
            DateTime? finB)
        {
            DateTime finRealA =
                finA?.Date ?? DateTime.MaxValue.Date;

            DateTime finRealB =
                finB?.Date ?? DateTime.MaxValue.Date;

            return inicioA.Date <= finRealB &&
                   inicioB.Date <= finRealA;
        }
    }
}