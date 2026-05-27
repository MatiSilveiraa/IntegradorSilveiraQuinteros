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

        void Agregar(Cuota cuota);

        void Modificar(Cuota cuota);
    }
}