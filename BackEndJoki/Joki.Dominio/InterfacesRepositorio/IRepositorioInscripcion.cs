using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioInscripcion
    {
        void Agregar(Inscripcion inscripcion);

        void Remover(int alumnoId, int claseId);

        bool Existe(int alumnoId, int claseId);

        int CantidadPorClase(int claseId);

        IEnumerable<Inscripcion> ObtenerPorAlumno(int alumnoId);
    }
}