using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioAlumno
    {
        int Agregar(Alumno alumno);

        int ContarActivos();

        IEnumerable<Alumno> ObtenerTodos();

        IEnumerable<Alumno> ObtenerActivos();

        Alumno? ObtenerPorId(int id);
        void Modificar(Alumno alumno);
    }
}
