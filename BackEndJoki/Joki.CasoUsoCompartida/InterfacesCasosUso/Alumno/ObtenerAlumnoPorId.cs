using Joki.CasoUsoCompartida.DTOs.Alumno;
namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno
{
    public interface IObtenerAlumnoPorId
    {
        DtoAlumno Ejecutar(int id);
    }
}
