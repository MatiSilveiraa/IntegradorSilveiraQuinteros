using Joki.CasoUsoCompartida.DTOs.Cuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class ObtenerCuotasAdmin : IObtenerCuotasAdmin
    {
        private readonly IRepositorioCuota _repositorioCuota;

        public ObtenerCuotasAdmin(
            IRepositorioCuota repositorioCuota)
        {
            _repositorioCuota = repositorioCuota;
        }

        public IEnumerable<CuotaAdminResponse> Ejecutar(
            string? estado,
            int? alumnoId,
            int? mes,
            int? anio,
            string? buscar)
        {
            var cuotas =
                _repositorioCuota.ObtenerTodasConAlumnoYPagos()
                    .ToList();

            if (!string.IsNullOrWhiteSpace(estado) &&
                Enum.TryParse<EstadoCuota>(
                    estado,
                    true,
                    out var estadoEnum))
            {
                cuotas = cuotas
                    .Where(c => c.Estado == estadoEnum)
                    .ToList();
            }

            if (alumnoId.HasValue)
            {
                cuotas = cuotas
                    .Where(c => c.AlumnoId == alumnoId.Value)
                    .ToList();
            }

            if (mes.HasValue)
            {
                cuotas = cuotas
                    .Where(c => c.Mes == mes.Value)
                    .ToList();
            }

            if (anio.HasValue)
            {
                cuotas = cuotas
                    .Where(c => c.Anio == anio.Value)
                    .ToList();
            }

            if (!string.IsNullOrWhiteSpace(buscar))
            {
                string texto =
                    buscar.Trim().ToLower();

                cuotas = cuotas
                    .Where(c =>
                        c.Alumno.Nombre.Valor.ToLower().Contains(texto) ||
                        c.Alumno.Apellido.Valor.ToLower().Contains(texto) ||
                        c.Alumno.Email.Valor.ToLower().Contains(texto))
                    .ToList();
            }

            return cuotas.Select(c =>
            {
                var pagoAprobado =
                    c.Pagos
                        .Where(p => p.Estado == EstadoPago.APROBADO)
                        .OrderByDescending(p => p.FechaPago)
                        .FirstOrDefault();

                return new CuotaAdminResponse
                {
                    CuotaId = c.Id,
                    AlumnoId = c.AlumnoId,
                    AlumnoNombre =
                        $"{c.Alumno.Nombre.Valor} {c.Alumno.Apellido.Valor}",
                    Email = c.Alumno.Email.Valor,
                    Mes = c.Mes,
                    Anio = c.Anio,
                    MontoBase = c.MontoBase,
                    Descuento = c.Descuento,
                    MontoFinal = c.MontoFinal,
                    Estado = c.Estado.ToString(),
                    FechaVencimiento = c.FechaVencimiento,
                    FechaPago = pagoAprobado?.FechaPago,
                    BloqueadoPorDeuda = c.Alumno.BloqueadoPorDeuda,
                    Bonificada = c.MontoFinal == 0,
                    Vencida =
                        c.Estado != EstadoCuota.PAGADA &&
                        c.FechaVencimiento.Date < DateTime.Now.Date
                };
            }).ToList();
        }
    }
}