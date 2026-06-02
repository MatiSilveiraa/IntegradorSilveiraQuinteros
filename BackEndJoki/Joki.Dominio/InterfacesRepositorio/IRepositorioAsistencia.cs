using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioAsistencia
    {
        void Agregar(Asistencia asistencia);

        bool ExisteAsistencia(int alumnoId, int claseId, DateTime fecha);

        List<Asistencia> ObtenerUltimasAsistencias(int alumnoId, int cantidad);

        IEnumerable<Asistencia> ObtenerPorAlumno(int alumnoId);
    }
}
