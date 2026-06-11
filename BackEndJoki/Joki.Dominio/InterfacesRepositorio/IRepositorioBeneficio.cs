using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioBeneficio
    {
        void Agregar(Beneficio beneficio);

        void Modificar(Beneficio beneficio);
        Beneficio? ObtenerPorId(int id);
        int ContarPendientes();

        int ContarFisicosPendientes();

        IEnumerable<Beneficio> ObtenerPendientesPorAlumno(
            int alumnoId);

        IEnumerable<Beneficio> ObtenerPorAlumno(
            int alumnoId);

        IEnumerable<Beneficio> ObtenerPendientesPorDescuento(
            int descuentoId);

        IEnumerable<Beneficio> ObtenerFisicosPendientes();
    }
}
