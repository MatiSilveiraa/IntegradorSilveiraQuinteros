using Joki.CasoUsoCompartida.DTOs.Alumno;
namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno
{
    public interface IObtenerAlumnoPorId
    {
        AlumnoDetalleResponse Ejecutar(int id);
    }
}
