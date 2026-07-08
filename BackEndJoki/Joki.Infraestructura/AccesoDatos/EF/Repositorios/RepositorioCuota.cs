using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace Joki.Infraestructura.AccesoDatos.EF.Repositorios
{
    public class RepositorioCuota : IRepositorioCuota
    {
        private readonly JokiContext _contexto;

        public RepositorioCuota(JokiContext contexto)
        {
            _contexto = contexto;
        }

        public Cuota? ObtenerPorId(int id)
        {
            return _contexto.Cuotas
                .FirstOrDefault(c => c.Id == id);
        }

        public Cuota? ObtenerPorAlumnoMesYAnio(
            int alumnoId,
            int mes,
            int anio)
        {
            return _contexto.Cuotas
                .FirstOrDefault(c =>
                    c.AlumnoId == alumnoId &&
                    c.Mes == mes &&
                    c.Anio == anio);
        }

        public void Agregar(Cuota cuota)
        {
            _contexto.Cuotas.Add(cuota);

            _contexto.SaveChanges();
        }

        public void Modificar(Cuota cuota)
        {
            _contexto.Cuotas.Update(cuota);

            _contexto.SaveChanges();
        }

        public IEnumerable<Cuota> ObtenerPorAlumno(int alumnoId)
        {
            return _contexto.Cuotas
                .Where(c => c.AlumnoId == alumnoId)
                .OrderByDescending(c => c.Anio)
                .ThenByDescending(c => c.Mes)
                .ToList();
        }

        public IEnumerable<Cuota> ObtenerPendientes()
        {
            return _contexto.Cuotas
                .Where(c => c.Estado == EstadoCuota.PENDIENTE)
                .ToList();
        }

        public int ContarPendientes()
        {
            return _contexto.Cuotas
                .Count(c => c.Estado == EstadoCuota.PENDIENTE);
        }

        public int ContarVencidas(DateTime fecha)
        {
            return _contexto.Cuotas
                .Count(c =>
                    (c.Estado == EstadoCuota.PENDIENTE ||
                     c.Estado == EstadoCuota.VENCIDA) &&
                    c.FechaVencimiento.Date < fecha.Date);
        }

        public IEnumerable<Cuota> ObtenerPendientesPorVencer(
    DateTime desde,
    DateTime hasta)
        {
            return _contexto.Cuotas
                .Where(c =>
                    c.Estado == EstadoCuota.PENDIENTE &&
                    c.FechaVencimiento.Date >= desde.Date &&
                    c.FechaVencimiento.Date <= hasta.Date)
                .ToList();
        }

        public IEnumerable<Cuota> ObtenerPendientesVencidas(
            DateTime fecha)
        {
            return _contexto.Cuotas
                .Where(c =>
                    c.Estado == EstadoCuota.PENDIENTE &&
                    c.FechaVencimiento.Date < fecha.Date)
                .ToList();
        }

        public IEnumerable<Cuota> ObtenerPendientesVencidasConAtraso(
    DateTime fecha,
    int diasAtraso)
        {
            DateTime fechaLimite =
                fecha.Date.AddDays(-diasAtraso);

            return _contexto.Cuotas
    .Where(c =>
        c.MontoFinal > 0 &&
        (c.Estado == EstadoCuota.PENDIENTE ||
         c.Estado == EstadoCuota.VENCIDA) &&
        c.FechaVencimiento.Date < fechaLimite)
    .ToList();
        }

        public bool TieneCuotasVencidasPendientes(
    int alumnoId,
    DateTime fecha,
    int diasAtraso)
        {
            DateTime fechaLimite =
                fecha.Date.AddDays(-diasAtraso);

            return _contexto.Cuotas
     .Any(c =>
         c.AlumnoId == alumnoId &&
         c.MontoFinal > 0 &&
         (c.Estado == EstadoCuota.PENDIENTE ||
          c.Estado == EstadoCuota.VENCIDA) &&
         c.FechaVencimiento.Date < fechaLimite);
        }

        public IEnumerable<Cuota> ObtenerTodasConAlumnoYPagos()
        {
            return _contexto.Cuotas
                .Include(c => c.Alumno)
                .Include(c => c.Pagos)
                .OrderByDescending(c => c.Anio)
                .ThenByDescending(c => c.Mes)
                .ToList();
        }

        public Cuota? ObtenerPorIdConAlumnoYPagos(int id)
        {
            return _contexto.Cuotas
                .Include(c => c.Alumno)
                .Include(c => c.Pagos)
                .FirstOrDefault(c => c.Id == id);
        }
    }
}
