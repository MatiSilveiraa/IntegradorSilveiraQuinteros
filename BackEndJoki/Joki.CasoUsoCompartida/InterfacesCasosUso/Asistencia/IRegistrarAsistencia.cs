using Joki.CasoUsoCompartida.DTOs.Asistencia;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia
{
    public interface IRegistrarAsistencia
    {
        void Ejecutar(
            RegistrarAsistenciaRequest request,
            int usuarioId
        );
    }
}
