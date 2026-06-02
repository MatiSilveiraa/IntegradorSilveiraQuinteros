using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioPago
    {
        void Agregar(Pago pago);

        Pago? ObtenerPorReferenciaExterna(string referenciaExterna);

        void Modificar(Pago pago);

        IEnumerable<Pago> ObtenerPorCuota(int cuotaId);

        IEnumerable<Pago> ObtenerPorAlumno(int alumnoId);
    }
}