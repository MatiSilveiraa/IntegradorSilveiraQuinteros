using Joki.CasoUsoCompartida.DTOs.Historial;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Historial;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Historial
{
    public class ObtenerMiHistorial :
        IObtenerMiHistorial
    {
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioPago _repositorioPago;
        private readonly IRepositorioAsistencia _repositorioAsistencia;

        public ObtenerMiHistorial(
            IRepositorioCuota repositorioCuota,
            IRepositorioPago repositorioPago,
            IRepositorioAsistencia repositorioAsistencia)
        {
            _repositorioCuota = repositorioCuota;
            _repositorioPago = repositorioPago;
            _repositorioAsistencia = repositorioAsistencia;
        }

        public HistorialAlumnoResponse Ejecutar(
            int alumnoId)
        {
            var historial =
                new HistorialAlumnoResponse();

            var cuotas =
                _repositorioCuota
                    .ObtenerPorAlumno(alumnoId);

            historial.Cuotas =
                cuotas.Select(c =>
                    new HistorialCuotaResponse
                    {
                        Id = c.Id,
                        Mes = c.Mes,
                        Anio = c.Anio,
                        MontoFinal = c.MontoFinal,
                        Estado = c.Estado.ToString()
                    });

            var pagos =
                _repositorioPago
                    .ObtenerPorAlumno(alumnoId);

            historial.Pagos =
                pagos.Select(p =>
                    new HistorialPagoResponse
                    {
                        Id = p.Id,
                        CuotaId = p.CuotaId,
                        MedioPago =
                            p.MedioPago.ToString(),
                        FechaPago = p.FechaPago,
                        Monto = p.Monto,
                        Estado =
                            p.Estado.ToString(),
                        ReferenciaExterna =
                            p.ReferenciaExterna
                    });

            var asistencias =
                _repositorioAsistencia
                    .ObtenerPorAlumno(alumnoId);

            historial.Asistencias =
                asistencias.Select(a =>
                    new HistorialAsistenciaResponse
                    {
                        Id = a.Id,
                        ClaseId = a.ClaseId,
                        Fecha = a.Fecha,
                        Presente = true,
                        Estado = "Registrada"
                    });

            return historial;
        }
    }
}