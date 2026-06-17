using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class GenerarCuotaInicialAlumno :
        IGenerarCuotaInicialAlumno
    {
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioConfiguracionCuota _repositorioConfiguracionCuota;

        public GenerarCuotaInicialAlumno(
            IRepositorioCuota repositorioCuota,
            IRepositorioConfiguracionCuota repositorioConfiguracionCuota)
        {
            _repositorioCuota = repositorioCuota;
            _repositorioConfiguracionCuota = repositorioConfiguracionCuota;
        }

        public void Ejecutar(int alumnoId)
        {
            DateTime hoy = DateTime.Now;

            int mesActual = hoy.Month;
            int anioActual = hoy.Year;

            var cuotaExistente =
                _repositorioCuota.ObtenerPorAlumnoMesYAnio(
                    alumnoId,
                    mesActual,
                    anioActual);

            if (cuotaExistente != null)
            {
                return;
            }

            var configuracion =
                _repositorioConfiguracionCuota.ObtenerActiva();

            if (configuracion == null)
            {
                throw new LogicaNegocioException(
                    "No existe una configuración de cuota activa");
            }

            decimal montoBase =
                configuracion.MontoMensual;

            DateTime fechaVencimiento =
                hoy.Day <= 10
                    ? new DateTime(hoy.Year, hoy.Month, 10)
                    : hoy.AddDays(7);

            var cuota =
                new Entidades.Cuota
                {
                    AlumnoId = alumnoId,
                    Mes = mesActual,
                    Anio = anioActual,
                    FechaVencimiento = fechaVencimiento,
                    MontoBase = montoBase,
                    Descuento = 0,
                    MontoFinal = montoBase,
                    Estado = EstadoCuota.PENDIENTE
                };

            _repositorioCuota.Agregar(cuota);
        }
    }
}