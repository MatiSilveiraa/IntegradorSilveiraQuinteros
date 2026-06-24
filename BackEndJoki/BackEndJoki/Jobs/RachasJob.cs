using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;

namespace Joki.WebApi.Jobs
{
    public class RachasJob
    {
        private readonly IResetearRachasMensuales _resetearRachasMensuales;

        public RachasJob(
            IResetearRachasMensuales resetearRachasMensuales)
        {
            _resetearRachasMensuales =
                resetearRachasMensuales;
        }

        public void ResetearRachasMensuales()
        {
            _resetearRachasMensuales.Ejecutar();
        }
    }
}