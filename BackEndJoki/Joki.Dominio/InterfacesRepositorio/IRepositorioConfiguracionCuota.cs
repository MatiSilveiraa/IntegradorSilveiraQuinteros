using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioConfiguracionCuota
    {
        ConfiguracionCuota? ObtenerActiva();

        void Agregar(ConfiguracionCuota configuracion);

        void Modificar(ConfiguracionCuota configuracion);
    }
}