using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.InterfacesRepositorio
{
    public interface IRepositorioAlumno
    {
        int Agregar(Alumno alumno);

        IEnumerable<Alumno> ObtenerTodos();
    }
}
