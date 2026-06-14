using Joki.CasoUsoCompartida.DTOs.Asistencia;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia
{
    public interface IRegistrarAsistenciaGeolocalizacion
    {
        void Ejecutar(
            RegistrarAsistenciaGeolocalizacionRequest request,
            int alumnoId);
    }
}