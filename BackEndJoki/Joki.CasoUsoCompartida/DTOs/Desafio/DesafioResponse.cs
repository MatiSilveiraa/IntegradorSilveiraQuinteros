namespace Joki.CasoUsoCompartida.DTOs.Desafio
{
    public class DesafioResponse
    {
        public int Id { get; set; }

        public string Titulo { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public DateTime FechaInicio { get; set; }

        public DateTime FechaFin { get; set; }

        public string Estado { get; set; } = string.Empty;

        public bool PuedeParticipar { get; set; }

        public bool YaParticipa { get; set; }

        public string? MotivoEstado { get; set; }
    }
}