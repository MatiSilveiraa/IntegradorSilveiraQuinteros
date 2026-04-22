using Joki.CasoUsoCompartida.DTOs.Alumno;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno
{
    public interface IRegistrarAlumno
    {
        RegistrarAlumnoResponse Ejecutar(RegistrarAlumnoRequest request);
    }
}
