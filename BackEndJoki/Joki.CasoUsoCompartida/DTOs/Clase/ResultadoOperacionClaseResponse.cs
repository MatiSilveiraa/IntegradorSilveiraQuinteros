namespace Joki.CasoUsoCompartida.DTOs.Clase
{
    public class ResultadoOperacionClaseResponse
    {
        public bool RequiereConfirmacion { get; set; }

        public string Mensaje { get; set; } = string.Empty;

        public ClaseResponse? Clase { get; set; }

        public List<ConflictoEntrenadorResponse> Conflictos { get; set; }
            = new();
    }
}