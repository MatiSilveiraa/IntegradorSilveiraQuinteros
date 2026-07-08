using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class GenerarCuotasMensuales : IGenerarCuotasMensuales
    {
        private readonly IRepositorioAlumno _repositorioAlumno;
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioConfiguracionCuota _repositorioConfiguracionCuota;
        private readonly IRepositorioBeneficio _repositorioBeneficio;

        public GenerarCuotasMensuales(
            IRepositorioAlumno repositorioAlumno,
            IRepositorioCuota repositorioCuota,
            IRepositorioConfiguracionCuota repositorioConfiguracionCuota,
            IRepositorioBeneficio repositorioBeneficio)
        {
            _repositorioAlumno = repositorioAlumno;
            _repositorioCuota = repositorioCuota;
            _repositorioConfiguracionCuota = repositorioConfiguracionCuota;
            _repositorioBeneficio = repositorioBeneficio;
        }

        public void Ejecutar()
        {
            int mesActual = DateTime.Now.Month;
            int anioActual = DateTime.Now.Year;

            var configuracion =
                _repositorioConfiguracionCuota.ObtenerActiva();

            decimal montoBase = 1390m;

            if (configuracion != null)
            {
                montoBase = configuracion.MontoMensual;
            }

            var alumnosActivos =
                _repositorioAlumno.ObtenerActivos();

            foreach (var alumno in alumnosActivos)
            {
                var cuotaExistente =
                    _repositorioCuota.ObtenerPorAlumnoMesYAnio(
                        alumno.UsuarioId,
                        mesActual,
                        anioActual);

                if (cuotaExistente == null)
                {
                    var beneficios =
                        _repositorioBeneficio
                            .ObtenerPendientesPorAlumno(
                                alumno.UsuarioId)
                            .ToList();

                    bool tieneCuotaGratis =
                            beneficios.Any(b => b.CuotaGratis);

                    decimal porcentajeDescuento =
                        beneficios
                            .Where(b => b.Descuento != null)
                            .Sum(b => b.Descuento!.Porcentaje);

                    if (porcentajeDescuento > 100)
                    {
                        porcentajeDescuento = 100;
                    }

                    decimal montoDescuento =
                        montoBase * porcentajeDescuento / 100;

                    decimal montoFinal =
                        montoBase - montoDescuento;

                    if (tieneCuotaGratis)
                    {
                        montoDescuento = montoBase;
                        montoFinal = 0m;
                    }

                    var cuota =
                        new LogicaNegocio.Entidades.Cuota
                        {
                            AlumnoId = alumno.UsuarioId,
                            Mes = mesActual,
                            Anio = anioActual,
                            FechaVencimiento =
                                new DateTime(
                                    anioActual,
                                    mesActual,
                                    10),
                            MontoBase = montoBase,
                            Descuento = montoDescuento,
                            MontoFinal = montoFinal,
                            Estado = montoFinal == 0m
    ? EstadoCuota.PAGADA
    : EstadoCuota.PENDIENTE
                        };

                    _repositorioCuota.Agregar(cuota);

                    foreach (var beneficio in beneficios)
                    {
                        beneficio.MesesAplicados++;

                        if (beneficio.MesesAplicados >=
                            beneficio.MesesDuracion)
                        {
                            beneficio.Estado =
                                EstadoBeneficio.OTORGADO;
                        }

                        _repositorioBeneficio.Modificar(
                            beneficio);
                    }
                }
            }
        }
    }
}