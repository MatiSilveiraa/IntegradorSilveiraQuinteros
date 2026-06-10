namespace Joki.CasoUsoCompartida.DTOs.Desafio
{
    public class MiDesafioResponse
    {
        public int DesafioId { get; set; }

        public string Titulo { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public DateTime FechaInicio { get; set; }

        public DateTime FechaFin { get; set; }

        public bool Participa { get; set; }

        public bool Ganador { get; set; }

        public string Resultado { get; set; } = string.Empty;
    }
}