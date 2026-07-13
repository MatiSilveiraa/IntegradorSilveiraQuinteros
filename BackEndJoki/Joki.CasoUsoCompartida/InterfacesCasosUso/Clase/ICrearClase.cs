using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface ICrearClase
    {
        ResultadoOperacionClaseResponse Ejecutar(
            CrearClaseRequest request,
            int usuarioId);
    }
}