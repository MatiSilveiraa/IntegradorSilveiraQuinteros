using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class MarcarCuotaComoPagada : IMarcarCuotaComoPagada
    {
        private readonly IRepositorioCuota _repositorioCuota;

        public MarcarCuotaComoPagada(IRepositorioCuota repositorioCuota)
        {
            _repositorioCuota = repositorioCuota;
        }

        public void Ejecutar(int cuotaId)
        {
            var cuota = _repositorioCuota.ObtenerPorId(cuotaId);

            if (cuota == null)
            {
                throw new LogicaNegocioException(
                    "Cuota no encontrada");
            }

            if (cuota.Estado == EstadoCuota.PAGADA)
            {
                throw new LogicaNegocioException(
                    "La cuota ya se encuentra pagada");
            }

            cuota.Estado = EstadoCuota.PAGADA;

            _repositorioCuota.Modificar(cuota);
        }
    }
}