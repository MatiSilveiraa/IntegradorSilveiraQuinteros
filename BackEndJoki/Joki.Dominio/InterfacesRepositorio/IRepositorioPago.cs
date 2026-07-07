using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaNegocio.InterfacesRepositorio

{
    public interface IRepositorioPago
    {
        void Agregar(Pago pago);

        Pago? ObtenerPorReferenciaExterna(string referenciaExterna);

        Pago? ObtenerPorId(int id);

        void Modificar(Pago pago);
        decimal ObtenerIngresosDelMes(
    int mes,
    int anio);

        IEnumerable<Pago> ObtenerPorCuota(int cuotaId);

        IEnumerable<Pago> ObtenerPorAlumno(int alumnoId);
        List<IngresoMensual> ObtenerIngresosUltimos6Meses();
    }
}