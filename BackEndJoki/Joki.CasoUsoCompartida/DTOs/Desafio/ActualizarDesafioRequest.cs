namespace Joki.CasoUsoCompartida.DTOs.Desafio
{
    public class ActualizarDesafioRequest
    {
        public string Titulo { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public DateTime FechaInicio { get; set; }

        public DateTime FechaFin { get; set; }
    }
}