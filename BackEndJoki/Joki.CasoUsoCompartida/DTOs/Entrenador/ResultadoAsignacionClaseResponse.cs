using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class ResultadoAsignacionClaseResponse
    {
        public bool RequiereConfirmacion { get; set; }

        public string Mensaje { get; set; } =
            string.Empty;

        public List<ConflictoEntrenadorResponse> Conflictos
        {
            get;
            set;
        } = new();
    }
}