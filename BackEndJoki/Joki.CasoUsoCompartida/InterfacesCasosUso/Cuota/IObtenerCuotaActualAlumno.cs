using Joki.CasoUsoCompartida.DTOs.Cuota;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota
{
    public interface IObtenerCuotaActualAlumno
    {
        CuotaResponse Ejecutar(int alumnoId);
    }
}
