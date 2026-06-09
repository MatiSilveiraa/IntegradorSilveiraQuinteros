using Joki.CasoUsoCompartida.DTOs.ConfiguracionCuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.ConfiguracionCuota;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.ConfiguracionCuota
{
    public class ObtenerConfiguracionCuota :
        IObtenerConfiguracionCuota
    {
        private readonly IRepositorioConfiguracionCuota _repositorioConfiguracionCuota;

        public ObtenerConfiguracionCuota(
            IRepositorioConfiguracionCuota repositorioConfiguracionCuota)
        {
            _repositorioConfiguracionCuota = repositorioConfiguracionCuota;
        }

        public ConfiguracionCuotaResponse Ejecutar()
        {
            var configuracion =
                _repositorioConfiguracionCuota.ObtenerActiva();

            if (configuracion == null)
            {
                return new ConfiguracionCuotaResponse
                {
                    MontoMensual = 1390m,
                    FechaDesde = DateTime.UtcNow
                };
            }

            return new ConfiguracionCuotaResponse
            {
                MontoMensual = configuracion.MontoMensual,
                FechaDesde = configuracion.FechaDesde
            };
        }
    }
}