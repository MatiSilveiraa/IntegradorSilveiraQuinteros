using Joki.CasoUsoCompartida.DTOs.Cuota;
using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class ObtenerDetalleCuotaAdmin :
        IObtenerDetalleCuotaAdmin
    {
        private readonly IRepositorioCuota _repositorioCuota;

        public ObtenerDetalleCuotaAdmin(
            IRepositorioCuota repositorioCuota)
        {
            _repositorioCuota = repositorioCuota;
        }

        public DetalleCuotaAdminResponse Ejecutar(int cuotaId)
        {
            var cuota =
                _repositorioCuota.ObtenerPorIdConAlumnoYPagos(cuotaId);

            if (cuota == null)
            {
                throw new LogicaNegocioException(
                    "Cuota no encontrada");
            }

            var pagoAprobado =
                cuota.Pagos
                    .Where(p => p.Estado == EstadoPago.APROBADO)
                    .OrderByDescending(p => p.FechaPago)
                    .FirstOrDefault();

            var beneficiosAplicados =
                new List<string>();

            if (cuota.Descuento > 0)
            {
                beneficiosAplicados.Add(
                    $"Descuento aplicado: {cuota.Descuento}");
            }

            if (cuota.MontoFinal == 0)
            {
                beneficiosAplicados.Add(
                    "Cuota bonificada");
            }

            return new DetalleCuotaAdminResponse
            {
                Cuota = new CuotaAdminResponse
                {
                    CuotaId = cuota.Id,
                    AlumnoId = cuota.AlumnoId,
                    AlumnoNombre =
                        $"{cuota.Alumno.Nombre.Valor} {cuota.Alumno.Apellido.Valor}",
                    Email = cuota.Alumno.Email.Valor,
                    Mes = cuota.Mes,
                    Anio = cuota.Anio,
                    MontoBase = cuota.MontoBase,
                    Descuento = cuota.Descuento,
                    MontoFinal = cuota.MontoFinal,
                    Estado = cuota.Estado.ToString(),
                    FechaVencimiento = cuota.FechaVencimiento,
                    FechaPago = pagoAprobado?.FechaPago,
                    BloqueadoPorDeuda = cuota.Alumno.BloqueadoPorDeuda,
                    Bonificada = cuota.MontoFinal == 0,
                    Vencida =
                        cuota.Estado != EstadoCuota.PAGADA &&
                        cuota.FechaVencimiento.Date < DateTime.Now.Date
                },

                Pagos = cuota.Pagos.Select(p =>
                    new PagoResponse
                    {
                        Id = p.Id,
                        CuotaId = p.CuotaId,
                        MedioPago = p.MedioPago.ToString(),
                        FechaPago = p.FechaPago,
                        Monto = p.Monto,
                        Estado = p.Estado.ToString(),
                        ReferenciaExterna = p.ReferenciaExterna
                    }).ToList(),

                BeneficiosAplicados = beneficiosAplicados
            };
        }
    }
}