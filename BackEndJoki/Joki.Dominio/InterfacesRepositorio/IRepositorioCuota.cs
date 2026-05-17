using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioCuota
    {
        Cuota? ObtenerPorAlumnoMesYAnio(int alumnoId, int mes, int anio);

        void Agregar(Cuota cuota);

        void Modificar(Cuota cuota);
    }
}
