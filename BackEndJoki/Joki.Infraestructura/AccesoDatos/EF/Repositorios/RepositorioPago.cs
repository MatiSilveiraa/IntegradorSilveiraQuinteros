using Joki.Infraestructura.AccesoDatos.EF;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.Infraestructura.AccesoDatos.Repositorios
{
    public class RepositorioPago : IRepositorioPago
    {
        private readonly JokiContext _contexto;

        public RepositorioPago(JokiContext contexto)
        {
            _contexto = contexto;
        }

        public void Agregar(Pago pago)
        {
            _contexto.Pagos.Add(pago);

            _contexto.SaveChanges();
        }

        public decimal ObtenerIngresosDelMes(
    int mes,
    int anio)
        {
            return _contexto.Pagos
                .Where(p =>
                    p.Estado == EstadoPago.APROBADO &&
                    p.FechaPago.Month == mes &&
                    p.FechaPago.Year == anio)
                .Sum(p => p.Monto);
        }

        public List<IngresoMensual> ObtenerIngresosUltimos6Meses()
        {
            var resultado = new List<IngresoMensual>();

            var hoy = DateTime.Today;

            for (int i = 5; i >= 0; i--)
            {
                var fecha = hoy.AddMonths(-i);

                var total = _contexto.Pagos
                    .Where(p =>
                        p.Estado == EstadoPago.APROBADO &&
                        p.FechaPago.Month == fecha.Month &&
                        p.FechaPago.Year == fecha.Year)
                    .Sum(p => (decimal?)p.Monto) ?? 0;

                resultado.Add(new IngresoMensual(
                    fecha.Month,
                    fecha.Year,
                    total));
            }

            return resultado;
        }

        public IEnumerable<Pago> ObtenerPorCuota(int cuotaId)
        {
            return _contexto.Pagos
                .Where(p => p.CuotaId == cuotaId)
                .ToList();
        }

        public void Modificar(Pago pago)
        {
            _contexto.Pagos.Update(pago);

            _contexto.SaveChanges();
        }

        public Pago? ObtenerPorReferenciaExterna(string referenciaExterna)
        {
            return _contexto.Pagos
                .FirstOrDefault(p => p.ReferenciaExterna == referenciaExterna);
        }

        public IEnumerable<Pago> ObtenerPorAlumno(int alumnoId)
        {
            return _contexto.Pagos
                .Where(p => p.Cuota.AlumnoId == alumnoId)
                .OrderByDescending(p => p.FechaPago)
                .ToList();
        }
    }
}