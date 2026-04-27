using Joki.CasoUsoCompartida.DTOs.Alumno;
namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno
{
    public interface IObtenerAlumnos
    {
        IEnumerable<DtoAlumno> Ejecutar();
    }
}
