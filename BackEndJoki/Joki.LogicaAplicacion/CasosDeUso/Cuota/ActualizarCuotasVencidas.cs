using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class ActualizarCuotasVencidas : IActualizarCuotasVencidas
    {
        private readonly IRepositorioCuota _repositorioCuota;

        public ActualizarCuotasVencidas(
            IRepositorioCuota repositorioCuota)
        {
            _repositorioCuota = repositorioCuota;
        }

        public void Ejecutar()
        {
            var cuotasPendientes =
                _repositorioCuota.ObtenerPendientes();

            foreach (var cuota in cuotasPendientes)
            {
                if (cuota.FechaVencimiento.Date < DateTime.Now.Date)
                {
                    cuota.Estado = EstadoCuota.VENCIDA;

                    _repositorioCuota.Modificar(cuota);
                }
            }
        }
    }
}