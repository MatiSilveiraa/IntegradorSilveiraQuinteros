using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;

namespace Joki.WebApi.Jobs
{
    public class CuotasJob
    {
        private readonly IGenerarCuotasMensuales _generarCuotasMensuales;
        private readonly IActualizarCuotasVencidas _actualizarCuotasVencidas;

        public CuotasJob(
            IGenerarCuotasMensuales generarCuotasMensuales,
            IActualizarCuotasVencidas actualizarCuotasVencidas)
        {
            _generarCuotasMensuales = generarCuotasMensuales;
            _actualizarCuotasVencidas = actualizarCuotasVencidas;
        }

        public void GenerarCuotasMensuales()
        {
            _generarCuotasMensuales.Ejecutar();
        }

        public void ActualizarCuotasVencidas()
        {
            _actualizarCuotasVencidas.Ejecutar();
        }
    }
}