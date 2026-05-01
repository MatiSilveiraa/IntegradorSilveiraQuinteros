using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioInscripcion
    {
        void Agregar(Inscripcion inscripcion);

        bool Existe(int alumnoId, int grupoId);

        int CantidadPorGrupo(int grupoId);

        bool TieneSuperposicion(int alumnoId, Grupo grupo);

        IEnumerable<Inscripcion> ObtenerPorAlumno(int alumnoId);
    }
}
