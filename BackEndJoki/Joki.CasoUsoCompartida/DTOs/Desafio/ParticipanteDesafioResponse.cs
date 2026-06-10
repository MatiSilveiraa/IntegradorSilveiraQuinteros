namespace Joki.CasoUsoCompartida.DTOs.Desafio
{
    public class ParticipanteDesafioResponse
    {
        public int AlumnoId { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public string Resultado { get; set; } = string.Empty;

        public bool Ganador { get; set; }
    }
}