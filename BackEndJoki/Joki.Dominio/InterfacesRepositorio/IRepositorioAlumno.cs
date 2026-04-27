using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioAlumno
    {
        int Agregar(Alumno alumno);

        IEnumerable<Alumno> ObtenerTodos();

        Alumno? ObtenerPorId(int id);
        void Modificar(Alumno alumno);
    }
}
