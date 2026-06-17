using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioCuota
    {

        Cuota? ObtenerPorId(int id);
        Cuota? ObtenerPorAlumnoMesYAnio(
            int alumnoId,
            int mes,
            int anio);

        IEnumerable<Cuota> ObtenerPorAlumno(
            int alumnoId);

        IEnumerable<Cuota> ObtenerPendientes();

        int ContarPendientes();

        int ContarVencidas(DateTime fecha);

        void Agregar(Cuota cuota);

        void Modificar(Cuota cuota);
        IEnumerable<Cuota> ObtenerPendientesPorVencer(
    DateTime desde,
    DateTime hasta);

        IEnumerable<Cuota> ObtenerPendientesVencidas(
            DateTime fecha);

        IEnumerable<Cuota> ObtenerPendientesVencidasConAtraso(
    DateTime fecha,
    int diasAtraso);

        bool TieneCuotasVencidasPendientes(
            int alumnoId,
            DateTime fecha,
            int diasAtraso);
    }
}