using Joki.LogicaNegocio.Enums;

namespace Joki.CasoUsoCompartida.DTOs.Clase
{
    public class CambiarEstadoClaseRequest
    {
        public EstadoClase Estado { get; set; }

        public string? Motivo { get; set; }
    }
}