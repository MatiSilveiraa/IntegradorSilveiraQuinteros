using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioPago
    {
        void Agregar(Pago pago);

        IEnumerable<Pago> ObtenerPorCuota(int cuotaId);
    }
}